let analysisResults = [], uploadedFiles = [], driveLinks = [];

const API = "https://resume-screening-skill-matching-system.onrender.com";

// Verify backend connectivity on load
async function checkHealth() {
  try {
    const res = await fetch(`${API}/health`);
    console.log("Backend Status:", res.ok ? "ONLINE" : "OFFLINE");
  } catch (e) {
    console.warn("Backend might be sleeping or unreachable:", e.message);
  }
}
checkHealth();

async function triggerTypeUpload(accept) {
  const input = document.getElementById("masterFileInput");
  input.accept = accept;
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    uploadedFiles = [...uploadedFiles, ...files];
    renderUI();
    e.target.value = null;
  };
  input.click();
}

function toggleDriveInput() {
  const el = document.getElementById("driveLinkEntry");
  el.classList.toggle("hidden");
  if (!el.classList.contains("hidden")) document.getElementById("excelDriveLink").focus();
}

function addLinkConfirm() {
  const input = document.getElementById("excelDriveLink");
  const val = input.value.trim();
  if (val) {
    driveLinks.push(val);
    input.value = "";
    document.getElementById("driveLinkEntry").classList.add("hidden");
    renderUI();
  }
}

async function matchFolder() {
  const jd = document.getElementById("jobDescription")?.value.trim();
  const loading = document.getElementById("loading");

  if (!jd || (!uploadedFiles.length && !driveLinks.length)) {
    return alert("Missing Data: Please provide a Job Description and at least one Resume document.");
  }

  loading.classList.remove("hidden");
  document.getElementById("analyzeBtn").disabled = true;

  try {
    const fd = new FormData();
    fd.append("job_description", jd);
    let url = `${API}/match-folder`;

    if (uploadedFiles.length) {
      // If multiple files, we ZIP them in the browser to save bandwidth and matching folder logic
      if (uploadedFiles.length === 1 && uploadedFiles[0].name.toLowerCase().endsWith('.zip')) {
        fd.append("folder", uploadedFiles[0], uploadedFiles[0].name);
      } else {
        const zip = new JSZip();
        for (let f of uploadedFiles) {
          const content = await f.arrayBuffer();
          zip.file(f.name, content);
        }
        const blob = await zip.generateAsync({ type: "blob" });
        fd.append("folder", blob, "batch_resumes.zip");
      }
    } else {
      url = `${API}/match-excel-link`;
      fd.append("excel_link", driveLinks[0]);
    }

    const limit = document.getElementById("topLimit")?.value;
    if (limit) fd.append("top_n", limit);

    console.log("Sending Analysis Request...");

    // Increased timeout for Render Free Tier (180s)
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 180000);

    const res = await fetch(url, {
      method: "POST",
      body: fd,
      signal: controller.signal
    });

    clearTimeout(id);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown API error" }));
      throw new Error(err.error || `Server Status ${res.status}`);
    }

    const data = await res.json();
    analysisResults = data.results || [];
    renderResultsGrid();

    if (analysisResults.length > 0) {
      document.getElementById("downloadReportBtn")?.classList.remove("hidden");
      document.getElementById("result")?.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert("No valid data found in the uploaded documents.");
    }
  } catch (e) {
    console.error("Match Process Error:", e);
    if (e.name === 'AbortError') {
      alert("The server is taking too long to respond. This usually happens when the AI model is loading. Please wait 10 seconds and click 'Analyze' again.");
    } else {
      alert("System Error: " + e.message + "\n\nPlease check if your backend is currently suspended on Render.");
    }
  } finally {
    loading.classList.add("hidden");
    document.getElementById("analyzeBtn").disabled = false;
  }
}

function renderResultsGrid() {
  const grid = document.getElementById("resultsGrid");
  const limitInput = document.getElementById("topLimit");
  if (!grid) return;
  const limit = parseInt(limitInput?.value) || 10;

  grid.innerHTML = "";
  if (!analysisResults.length) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">No matching data available yet.</div>';
    return;
  }

  const visible = [...analysisResults].sort((a, b) => b.score - a.score).slice(0, limit);

  visible.forEach(r => {
    const css = r.status.toLowerCase() === 'strong' ? 'strong' :
      r.status.toLowerCase() === 'good' ? 'good' :
        r.status.toLowerCase() === 'average' ? 'average' : 'below';

    const card = document.createElement("div");
    card.className = `result-card status-${css}`;
    card.innerHTML = `
      <div class="result-status-badge">${r.status}</div>
      <div class="result-header">
        <div class="result-name">${r.filename}</div>
        <div class="result-percentage">${r.score}% Match</div>
      </div>
      <div class="progress-container">
        <div class="progress-bar bar-${css}" style="width:${r.score}%"></div>
      </div>
      <div class="match-details">
        <p><strong>Analysis Summary:</strong> ${r.match_summary || "See skills below."}</p>
        <p><span style="color: #10b981; font-weight: 600;">✔ Skills Profile:</span> ${r.matched_keywords?.length ? r.matched_keywords.join(", ") : "None Detected"}</p>
        <p><span style="color: #ef4444; font-weight: 600;">✘ Gap Analysis:</span> ${r.missing_keywords?.length ? r.missing_keywords.join(", ") : "None Detected"}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderUI() {
  const grid = document.getElementById("fileGrid");
  const section = document.getElementById("filePreviewSection");
  if (!grid || !section) return;

  grid.innerHTML = "";
  if (!uploadedFiles.length && !driveLinks.length) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");

  uploadedFiles.forEach((f, i) => {
    const card = document.createElement("div");
    card.className = "file-card";
    card.innerHTML = `
      <div class="file-icon">${getIcon(f.name)}</div>
      <div class="file-name" title="${f.name}">${f.name}</div>
      <button onclick="removeFile(${i})" class="remove-btn">✕</button>
    `;
    grid.appendChild(card);
  });

  driveLinks.forEach((l, i) => {
    const card = document.createElement("div");
    card.className = "file-card";
    card.innerHTML = `
      <div class="file-icon">${getIcon('', true)}</div>
      <div class="file-name">Google Drive Asset</div>
      <button onclick="removeLink(${i})" class="remove-btn">✕</button>
    `;
    grid.appendChild(card);
  });
}

async function downloadExcelReport() {
  if (!analysisResults.length) return;
  try {
    const res = await fetch(`${API}/generate-excel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results: analysisResults })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Resume_Match_Report_${Date.now()}.xlsx`;
    a.click();
  } catch (e) { alert("XLSX Generation Failed: " + e.message); }
}

function getIcon(n, isDrive) {
  if (isDrive) return `<svg fill="#FFBA00" viewBox="0 0 24 24"><path d="M13.8 10L1.7 31.1h12.1l12.1-21.1z"/><path d="M25.8 10l-12 21.1 6 10.6 12-21.1z"/><path d="M31.9 31.1H7.7l-6 10.6h24.2z"/></svg>`;
  const ext = n.split('.').pop().toLowerCase();
  const colors = { pdf: '#ef4444', docx: '#3b82f6', doc: '#3b82f6', zip: '#f59e0b', txt: '#64748b' };
  return `<svg fill="${colors[ext] || '#94a3b8'}" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>`;
}

function removeFile(i) { uploadedFiles.splice(i, 1); renderUI(); }
function removeLink(i) { driveLinks.splice(i, 1); renderUI(); }
