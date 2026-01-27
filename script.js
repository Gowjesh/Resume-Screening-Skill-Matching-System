function matchSkills() {
  const fileInput = document.getElementById("resumeFile");
  const job = document.getElementById("job").value.trim();

  if (!fileInput.files.length || !job) {
    alert("Upload resume and enter job description");
    return;
  }

  const file = fileInput.files[0];

  if (file.name.endsWith(".docx")) {
    readDocx(file, job);
  } else if (file.name.endsWith(".txt")) {
    readTxt(file, job);
  } else {
    alert("Only TXT and DOCX files are supported");
  }
}

function readTxt(file, job) {
  const reader = new FileReader();
  reader.onload = function () {
    calculateMatch(reader.result.toLowerCase(), job.toLowerCase());
  };
  reader.readAsText(file);
}

function readDocx(file, job) {
  const reader = new FileReader();
  reader.onload = function (event) {
    mammoth.extractRawText({ arrayBuffer: event.target.result })
      .then(result => {
        const resumeText = result.value.toLowerCase();
        calculateMatch(resumeText, job.toLowerCase());
      })
      .catch(err => {
        alert("Error reading DOCX file");
        console.error(err);
      });
  };
  reader.readAsArrayBuffer(file);
}

function calculateMatch(resume, job) {
  const resumeWords = resume.split(/\W+/);
  const jobWords = job.split(/\W+/);

  let matchCount = 0;
  jobWords.forEach(word => {
    if (resumeWords.includes(word)) matchCount++;
  });

  const score = Math.min(
    100,
    Math.floor((matchCount / jobWords.length) * 100) + 40
  );

  document.getElementById("score").innerText = score + "%";
  document.getElementById("status").innerText =
    score >= 75 ? "Strong Match ✅" : "Partial Match ⚠️";

  document.getElementById("result").classList.remove("hidden");
}