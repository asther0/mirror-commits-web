# Deployment Guide

## Deploy to Vercel (Recommended)

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Vercel Dashboard

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Mirror Commits web tool"
git remote add origin https://github.com/asther0/mirror-commits-web.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/new)

3. Import your GitHub repository

4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Deploy!

Your site will be live at: `https://mirror-commits-web.vercel.app`

## Post-Deployment

### Update Script URL

After deployment, users can download your script directly:

```bash
curl -sL https://your-domain.vercel.app/mirror.sh -o mirror.sh
chmod +x mirror.sh
```

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Done!

## Environment Variables

This project doesn't require any environment variables - it's 100% static!

## Maintenance

### Update the Script

To update the bash script:

1. Edit `public/scripts/mirror.sh`
2. Commit and push changes
3. Vercel automatically redeploys

### Update UI

1. Edit files in `src/`
2. Test locally: `npm run dev`
3. Commit and push
4. Auto-deployed!

## Analytics (Optional)

Add Vercel Analytics:

```bash
npm i @vercel/analytics
```

In `src/app/layout.js`:

```javascript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Troubleshooting

### Build Fails

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Script Not Downloading

Check `vercel.json` configuration - the rewrite rule should map `/mirror.sh` to `/scripts/mirror.sh`.

### Styles Not Loading

Verify Tailwind configuration in `tailwind.config.js` includes all content paths.
