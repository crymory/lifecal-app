# Deployment Guide for Lifecal

## Deploy to Vercel

The easiest way to deploy Lifecal is using Vercel, the platform built by the creators of Next.js.

### Prerequisites

- A GitHub account
- A Vercel account (sign up at https://vercel.com)

### Step-by-Step Deployment

1. **Push your code to GitHub**
   ```bash
   # Initialize git repository if not already done
   git init
   git add .
   git commit -m "Initial commit"
   
   # Push to GitHub
   git branch -M main
   git remote add origin https://github.com/yourusername/lifecal-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select "Import Git Repository"
   - Find and import your `lifecal-app` repository

3. **Configure Environment**
   - Vercel will automatically detect Next.js
   - No additional environment variables are required
   - Click "Deploy"

4. **Your app is live!**
   - Vercel will provide you with a deployment URL (e.g., `https://lifecal-app.vercel.app`)
   - Each push to the `main` branch will trigger an automatic deployment

### Post-Deployment

Once deployed, update the calendar generation URLs in your iOS Shortcuts to use your Vercel domain:

```
https://your-app-name.vercel.app/api/calendar?goal=No%20Sugar&goal_date=2026-04-20&start_date=2026-02-20&height=2532&width=1170
```

### Troubleshooting

#### Canvas Build Issues
If you encounter issues with the canvas native module during build:
- Vercel automatically handles native module compilation
- No additional configuration is needed
- If problems persist, ensure you're using Node.js 18+

#### File System Limitations
Note: In production on Vercel, the `/data/goals.json` file will be reset on each deployment. For production-grade usage:
- Consider using a database service (MongoDB, PostgreSQL, etc.)
- Or use Vercel KV for persistent storage
- Or use a third-party BaaS like Firebase

### Custom Domain

1. Go to your Vercel project settings
2. Click on "Domains"
3. Enter your custom domain
4. Follow the DNS configuration instructions

For more details, see the [Vercel Documentation](https://vercel.com/docs).
