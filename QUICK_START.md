# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install & Configure (2 min)

```bash
cd /Users/stub/coding/ghost-headless-frontend-starter
npm install

# Create .env.local file
cat > .env.local << EOF
GHOST_API_URL=https://catsky.club/ghost/api/content
GHOST_CONTENT_API_KEY=0667d8e2c878c297cac36ec6c7
NEXT_PUBLIC_SITE_URL=https://catsky.club
EOF
```

### Step 2: Test Locally (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you should see your Ghost posts!

### Step 3: Deploy to Server

Follow the detailed guide in [DEPLOYMENT.md](./DEPLOYMENT.md) or use these quick commands:

```bash
# On your server
cd /opt
git clone YOUR_REPO_URL ghost-frontend  # or scp the files
cd ghost-frontend
npm install --production
npm run build

# Set environment
echo "GHOST_API_URL=https://catsky.club/ghost/api/content" > .env.production
echo "GHOST_CONTENT_API_KEY=0667d8e2c878c297cac36ec6c7" >> .env.production
echo "NEXT_PUBLIC_SITE_URL=https://catsky.club" >> .env.production

# Run with PM2
npm install -g pm2
pm2 start npm --name "ghost-frontend" -- start
pm2 save
pm2 startup
```

### Step 4: Configure Nginx

Copy `nginx.conf.example` to `/etc/nginx/sites-available/catsky.club` and update it.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full nginx setup.

---

## ✅ What You Have Now

- ✅ Minimalistic Next.js frontend
- ✅ Homepage with post listing
- ✅ Single post pages
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Ready to deploy

## 🎨 Customize

Edit `styles/globals.css` to change colors, fonts, and layout.

## 📚 Next Steps

1. Test locally: `npm run dev`
2. Customize design in `styles/globals.css`
3. Deploy following [DEPLOYMENT.md](./DEPLOYMENT.md)
4. Enjoy your new minimalistic frontend! 🎉

