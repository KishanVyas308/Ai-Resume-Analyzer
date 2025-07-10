# Deployment Guide

## Backend Deployment to Vercel

### Step 1: Prepare the Backend

The backend is configured for Vercel deployment with the `vercel.json` file.

### Step 2: Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

```
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=production
```

### Step 3: Deploy

```bash
cd Backend
vercel --prod
```

### Step 4: Update Frontend API URL

After deployment, update the frontend to use the production API URL:

In `Frontend/src/App.tsx`, change:
```typescript
const response = await fetch('http://localhost:3001/api/analyze-resume', {
```

To:
```typescript
const response = await fetch('https://your-backend-url.vercel.app/api/analyze-resume', {
```

## Frontend Deployment to Vercel

### Step 1: Update API URL

Make sure the frontend points to your deployed backend URL.

### Step 2: Deploy Frontend

```bash
cd Frontend
vercel --prod
```

## Environment Variables Required

### Backend
- `GROQ_API_KEY`: Your GROQ API key from console.groq.com
- `NODE_ENV`: Set to "production" for production deployment

### Frontend
- No environment variables required (API URL is hardcoded)

## Testing Deployment

1. Visit your deployed frontend URL
2. Upload a test resume (PDF/DOC/DOCX)
3. Enter a job description
4. Click "Analyze Resume"
5. Verify the analysis results appear correctly

## Troubleshooting

### Common Issues

1. **GROQ API Key Error**: Ensure the environment variable is set correctly in Vercel
2. **CORS Issues**: The backend includes CORS middleware for all origins
3. **File Upload Issues**: Vercel has file size limits; ensure files are under 5MB
4. **Build Failures**: Check that all dependencies are in package.json

### Vercel Logs

Check deployment logs in Vercel dashboard for detailed error information.
