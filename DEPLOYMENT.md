# Deployment Guide

## Frontend Deployment (Netlify)

### Step 1: Connect GitHub to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Select **GitHub** and authorize
4. Choose your repository: `professional-tracking-website`
5. Leave build settings as default and click **Deploy site**

Your site will be live at: `https://your-site-name.netlify.app`

---

## Backend Deployment (Railway)

### Step 1: Set up Railway Account
1. Go to [Railway.app](https://railway.app) and sign up
2. Create a new project

### Step 2: Deploy Node.js Backend
1. Click **+ New** → **GitHub Repo**
2. Select your `professional-tracking-website` repo
3. Click **Deploy**
4. In the **Variables** section, add:
   - `MONGODB_URI` = your MongoDB Atlas connection string (or leave default)
   - `PORT` = 5000

### Step 3: Get Your Backend URL
1. In Railway, go to your deployed service
2. Under **Networking**, copy the **Public URL** (e.g., `https://your-backend-name.up.railway.app`)
3. Note: This URL is YOUR BACKEND URL

---

## Update Frontend API URLs

### Step 1: Update script.js and results.js
Replace all instances of `window.location.hostname` URLs with your actual backend URL.

In **script.js** (around line 73):
```javascript
const apiHost = "your-backend-url.up.railway.app";
const apiBase = `https://${apiHost}`;
```

In **results.js** (around line 34):
```javascript
const apiHost = "your-backend-url.up.railway.app";
const apiBase = `https://${apiHost}`;
```

### Step 2: Update Backend CORS

In **backend/server.js**, update the CORS origin:
```javascript
app.use(cors({
  origin: "https://your-netlify-site.netlify.app"
}));
```

### Step 3: Push Changes to GitHub
```bash
git add -A
git commit -m "Update API URLs for production deployment"
git push
```

Your Netlify site will auto-rebuild and use the new backend URL.

---

## Testing

1. Visit your Netlify site: `https://your-site-name.netlify.app`
2. Enter a tracking number (e.g., `PG74833857558585`)
3. Click **Track** - should display shipment details from the Railway backend

---

## Troubleshooting

- **CORS errors**: Check that Railway backend URL is whitelisted in backend/server.js
- **Blank page**: Check browser console (F12) for errors
- **404 on track**: Verify the tracking number exists in the mock data

---

## Notes

- Railway provides a free tier with 500 hours/month (enough for a personal project)
- Netlify frontend is always free for static sites
- Backend will sleep after 15 minutes of inactivity on Railway free tier (will wake up on next request)
