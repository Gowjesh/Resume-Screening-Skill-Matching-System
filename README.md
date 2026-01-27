# Resume Screening & Skill Matching System

The Resume Screening & Skill Matching System is a full-stack web application that uses NLP and Sentence Transformer models to semantically match resumes with job descriptions. It supports multiple file formats, reduces manual screening, improves accuracy, and enables intelligent, bias-reduced recruitment.

---

## Key Features
- **NLP-Powered Matching**: Uses Sentence Transformers (`all-MiniLM-L6-v2`)
- **Dynamic Hybrid Algorithm**: 60% Semantic understanding + 40% Keyword matching with high variance for better differentiation.
- **Score Range**: Optimised 55-100% range for relevant candidates.
- **Multi-Format Support**: PDF, DOCX, TXT, XLSX, ZIP
- **Google Drive Integration**: Paste Drive links for Excel files
- **Excel Reports**: Download detailed analysis reports

---

## Project Structure
- `backend/`: FastAPI server and NLP engine
- `frontend/`: Web interface (HTML/CSS/JS)
- `README.md`: System documentation

---

## Daily Progress
**Day 1**

A basic and user-friendly frontend was created using HTML, CSS, and JavaScript. Users can upload TXT and DOCX resume files and enter job descriptions through a text area. The UI was designed with simplicity in mind, and future support for Excel files and Google Drive links was planned. here first used the mammoth model.

<img width="1890" height="906" alt="Screenshot 2026-01-24 091257" src="https://github.com/user-attachments/assets/7e2bf7f7-e33f-4eb3-8c7c-7cd35df9ea17" />

**Day 2**

Then Removed the mammoth model and strat adding the beackend folder. The project was organized into separate frontend and backend folders for better structure and maintainability. Backend files such as main.py and requirements.txt were set up, preparing the system for scalable development and future integrations like Excel and Drive-based resumes.

**Day 3**

The backend was implemented using FastAPI, and the SentenceTransformer (all-MiniLM-L6-v2) model was integrated for semantic resume matching. API communication between frontend and backend was established using JSON responses and data models. By the help of a NLP SentencesTransformer (all-MiniLM-L6-v2) model, we match the resume.docx file and get successfully outcome.

**Day 4**

For adding all type of files in DOCX,PDF,TXT and Zip but It have backend problem. So, the Python virtual environment (venv) was created to manage all dependencies safely. Required libraries for NLP, document processing, Excel handling, and Google Drive downloads were installed inside the virtual environment to ensure consistent execution across systems.

<img width="1245" height="893" alt="Screenshot 2026-01-24 102551" src="https://github.com/user-attachments/assets/782450ae-1b7d-4ac7-9d7a-7d179222546e" />

**Day 5**

The backend was enhanced to support multiple resume formats such as PDF, DOCX, TXT, Excel, ZIP files, and Google Drive links. Custom text extraction logic was implemented for each file type, making the system practical for real-world resume inputs.

**Day 6**

The frontend UI was improved by displaying resumes in a card-based layout. Each card shows resume details, match score, and source type (file upload, Excel, or Drive link). Resumes are sorted from highest to lowest score for easy comparison. But in the project can't render because of using large library and files. So, that the project backend can't run without the help of Domain. I have Try to deploy the backend in RENDER website, It crashed.

**Day 7**

Only the Frontend can deploy in the vercel. The scoring logic was optimized to improve accuracy. Only top-matching resumes are displayed, and the system highlights matched skills and missing skills from each resume. Final testing confirmed reliable performance across all supported file formats. Atlast push the Project into the GitHub connect with vercel.

<img width="1137" height="906" alt="Screenshot 2026-01-27 195721" src="https://github.com/user-attachments/assets/89da67c4-71ed-409e-980e-fd2365952084" />

<img width="1112" height="643" alt="Screenshot 2026-01-27 195731" src="https://github.com/user-attachments/assets/3dfbe41a-1dda-4471-8689-2c6a44f52da5" />

---


