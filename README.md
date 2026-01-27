# Resume Screening & Skill Matching System

The Resume Screening & Skill Matching System is a full-stack web application that uses NLP and Sentence Transformer models to semantically match resumes with job descriptions. It supports multiple file formats, reduces manual screening, improves accuracy, and enables intelligent, bias-reduced recruitment.

## 🚀 Quick Start

### 1. Backend Server (Port 8000)
1. Open a terminal in `backend/`
2. Run: `start_server.bat`
3. Wait for: "NLP Model loaded successfully. Server is ready."

### 2. Frontend Server (Port 5500)
1. Open a terminal in the root directory
2. Run: `python -m http.server 5500`
3. Access: [http://127.0.0.1:5500/frontend/index.html](http://127.0.0.1:5500/frontend/index.html)

## 🎯 Key Features
- **NLP-Powered Matching**: Uses Sentence Transformers (`all-MiniLM-L6-v2`)
- **Dynamic Hybrid Algorithm**: 60% Semantic understanding + 40% Keyword matching with high variance for better differentiation.
- **Score Range**: Optimised 55-100% range for relevant candidates.
- **Multi-Format Support**: PDF, DOCX, TXT, XLSX, ZIP
- **Google Drive Integration**: Paste Drive links for Excel files
- **Excel Reports**: Download detailed analysis reports

## 📁 Project Structure
- `backend/`: FastAPI server and NLP engine
- `frontend/`: Web interface (HTML/CSS/JS)
- `README.md`: System documentation
