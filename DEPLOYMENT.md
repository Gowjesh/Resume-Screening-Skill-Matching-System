# 🚀 Vercel Deployment Guide

## 📋 Prerequisites
- GitHub repository with the code
- Vercel account (free)
- All files committed to GitHub

## 🛠️ Deployment Steps

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Login"
3. Connect your GitHub account
4. Click "New Project"

### 2. Import Repository
1. Find your repository: `Resume-Screening-Skill-Matching-System`
2. Click "Import"

### 3. Configure Settings
```
Framework Preset: Other
Root Directory: ./
Build Command: echo "Build complete"
Output Directory: .
Install Command: pip install -r requirements.txt
```

### 4. Environment Variables (if needed)
No environment variables required for basic deployment.

### 5. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at: `https://your-app-name.vercel.app`

## 🔧 Configuration Details

### Vercel.json Structure
- **API Routes**: `/api/*` → Python backend
- **Static Files**: `/*` → Frontend files
- **Runtime**: Python 3.9
- **Dependencies**: Auto-installed from requirements.txt

### File Structure for Deployment
```
├── api/index.py          # Vercel serverless entry point
├── backend/main.py       # FastAPI application
├── frontend/             # Static files
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel configuration
└── package.json         # Node.js metadata
```

## 🌐 How It Works

### API Endpoints
- `POST /api/match-folder` - Process uploaded files
- `POST /api/match-excel-link` - Process Drive links
- `POST /api/generate-excel` - Download reports

### Frontend
- Served from root directory
- Automatically detects local vs production environment
- API calls route to `/api/*` in production

## 🧪 Testing After Deployment

1. **Basic Test**: Visit your deployed URL
2. **Upload Test**: Try uploading a sample resume
3. **Drive Link Test**: Test with a Google Drive link
4. **Results Check**: Verify analysis results display

## 🔍 Troubleshooting

### Common Issues

**1. Build Failures**
- Check requirements.txt for correct dependencies
- Verify all files are committed to Git

**2. API Errors**
- Check Vercel function logs
- Verify API routes in vercel.json

**3. Frontend Issues**
- Check browser console for errors
- Verify API URL detection logic

**4. Model Loading Issues**
- Vercel has cold start delays for first load
- Model may take 10-30 seconds to initialize

### Debug Commands
```bash
# Check Vercel logs
vercel logs

# Local testing
npm run dev
```

## 📈 Performance Tips

1. **Cold Starts**: First API call may be slow (model loading)
2. **Memory Limits**: Large files may timeout
3. **Concurrent Users**: Free tier has limitations

## 🔄 Updates

To update after deployment:
1. Push changes to GitHub
2. Vercel auto-deploys on push to main branch
3. Or manually trigger redeploy in Vercel dashboard

## 📞 Support

If issues persist:
1. Check Vercel deployment logs
2. Verify all configuration files
3. Test locally first
4. Check GitHub repository structure
