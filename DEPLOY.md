# Deploying to Vercel

## Quick Deploy (CLI Method)

1. **Login to Vercel** (if not already logged in):
   ```bash
   vercel login
   ```
   This will open your browser to authenticate.

2. **Deploy your site**:
   ```bash
   vercel
   ```
   
   When prompted:
   - **Set up and deploy?** → Yes
   - **Which scope?** → Select your account
   - **Link to existing project?** → No (for first time)
   - **Project name?** → Press Enter (uses "turn" as default)
   - **Directory?** → Press Enter (uses current directory)
   - **Override settings?** → No

3. **Your site will be deployed!** You'll get a URL like `https://turn-xxxxx.vercel.app`

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

## Alternative: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Vercel will auto-detect it's a static site
5. Click "Deploy"

## Troubleshooting

- **If deployment fails**: Make sure all files are committed to git
- **If assets don't load**: Check that `assets/` folder is included
- **If you need a custom domain**: Add it in Vercel dashboard → Settings → Domains



