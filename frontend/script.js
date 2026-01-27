let analysisResults = [], uploadedFiles = [], driveLinks = [];

const API = "https://resume-screening-skill-matching-system.onrender.com";

// Check backend health on load
window.onload = async () => {
  try {
    const res = await fetch(`${API}/health`);
    if (res.ok) console.log("Backend Connection: OK");
    else console.error("Backend Connection: FAILED", res.status);
  } catch (e) {
    console.error("Backend Connection: ERROR", e);
  }
};

async function triggerTypeUpload(accept) {
  const input = document.getElementById("masterFileInput");
  input.accept = accept;
  input.onchange = (e) => {
    uploadedFiles = [...uploadedFiles, ...Array.from(e.target.files)];
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
  if (input.value.trim()) {
    driveLinks.push(input.value.trim());
    input.value = "";
    document.getElementById("driveLinkEntry").classList.add("hidden");
    renderUI();
  }
}

async function matchFolder() {
  const jdEl = document.getElementById("jobDescription");
  const jd = jdEl ? jdEl.value.trim() : "";
  const loading = document.getElementById("loading");

  if (!jd || (!uploadedFiles.length && !driveLinks.length)) {
    return alert("Please provide both a Job Description and Resumes (Files or Links).");
  }

  loading.classList.remove("hidden");
  try {
    const fd = new FormData();
    fd.append("job_description", jd);
    let url = `${API}/match-folder`;

    if (uploadedFiles.length) {
      if (uploadedFiles.length === 1 && uploadedFiles[0].name.toLowerCase().endsWith('.zip')) {
        fd.append("folder", uploadedFiles[0], uploadedFiles[0].name);
      } else {
        const zip = new JSZip();
        for (let f of uploadedFiles) zip.file(f.name, await f.arrayBuffer());
        const blob = await zip.generateAsync({ type: "blob" });
        fd.append("folder", blob, "resumes.zip");
      }
    } else {
      url = `${API}/match-excel-link`;
      fd.append("excel_link", driveLinks[0]);
    }

    const limitEl = document.getElementById("topLimit");
    const limit = limitEl ? limitEl.value : null;
    if (limit && limit > 0) fd.append("top_n", limit);

    console.log("Contacting Backend:", url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    const res = await fetch(url, {
      method: "POST",
      body: fd,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server Error: ${res.status}`);
    }

    const data = await res.json();
    analysisResults = data.results || [];
    renderResultsGrid();

    if (analysisResults.length > 0) {
      document.getElementById("downloadReportBtn")?.classList.remove("hidden");
      document.getElementById("result")?.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert("No resumes found to analyze.");
    }
  } catch (e) {
    console.error("Fetch Error:", e);
    if (e.name === 'AbortError') {
      alert("The server is taking too long to respond. This happens usually on the first request while the AI model loads. Please try clicking 'Analyze' one more time.");
    } else {
      alert("Connection Error: " + e.message + "\n\nMake sure the backend is live at: " + API);
    }
  } finally {
    loading.classList.add("hidden");
  }
}

function renderResultsGrid() {
  const grid = document.getElementById("resultsGrid");
  const limitInput = document.getElementById("topLimit");
  if (!grid || !limitInput) return;
  const limit = parseInt(limitInput.value) || 10;
  grid.innerHTML = "";
  if (!analysisResults.length) {
    grid.innerHTML = '<div id="resultsPlaceholder" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #64748b;"><p>No results yet.</p></div>';
    return;
  }
  const visible = [...analysisResults].sort((a, b) => b.score - a.score).slice(0, limit);
  visible.forEach(r => {
    const statusMap = { "Strong": "strong", "Good": "good", "Average": "average", "Poor": "below" };
    const cssClass = statusMap[r.status] || "below";
    const div = document.createElement("div");
    div.className = `result-card status-${cssClass}`;
    div.innerHTML = `
      <div class="result-status-badge status-${cssClass}">${r.status}</div>
      <div class="result-header">
        <div class="result-name">${r.filename}</div>
        <div class="result-percentage">${r.score}%</div>
      </div>
      <div class="progress-container"><div class="progress-bar bar-${cssClass}" style="width:${r.score}%"></div></div>
      <div class="match-details">
        <p><strong>Summary:</strong> ${r.match_summary || "N/A"}</p>
        <p><span style="color: #10b981;">✔ Matched:</span> ${r.matched_keywords?.join(", ") || "None"}</p>
        <p><span style="color: #ef4444;">✘ Missing:</span> ${r.missing_keywords?.join(", ") || "None"}</p>
      </div>
    `;
    grid.appendChild(div);
  });
}

function renderUI() {
  const grid = document.getElementById("fileGrid");
  const section = document.getElementById("filePreviewSection");
  if (!grid || !section) return;
  grid.innerHTML = "";
  if (!uploadedFiles.length && !driveLinks.length) return section.classList.add("hidden");
  section.classList.remove("hidden");
  uploadedFiles.forEach((f, i) => {
    const div = document.createElement("div"); div.className = "file-card";
    div.innerHTML = `<div class="file-icon">${getIcon(f.name)}</div><div class="file-name">${f.name}</div><button onclick="removeFile(${i})" class="remove-btn">✕</button>`;
    grid.appendChild(div);
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
    a.href = url;
    a.download = `Analysis_Report.xlsx`;
    a.click();
  } catch (e) { alert("Download failed: " + e.message); }
}

function getIcon(n, d = false) {
  if (d) return `<svg viewBox="0 0 40 40"><path d="M25.8 10l-12 21.1 6 10.6 12-21.1z" fill="#00A859"/><path d="M13.8 10L1.7 31.1h12.1l12.1-21.1z" fill="#0072B2"/><path d="M31.9 31.1H7.7l-6 10.6h24.2z" fill="#FFBA00"/></svg>`;
  const e = n.split('.').pop().toLowerCase(), m = { pdf: '#E11D48', docx: '#2563EB', doc: '#2563EB', xlsx: '#16A34A', zip: '#FBBF24', txt: '#64748b' };
  return `<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="3" fill="${m[e] || '#cbd5e1'}"/></svg>`;
}

function removeFile(i) { uploadedFiles.splice(i, 1); renderUI(); }
function removeLink(i) { driveLinks.splice(i, 1); renderUI(); }
function clearAllFiles() { uploadedFiles = []; driveLinks = []; renderUI(); }
