# Cloudflare Pages Deployment Guide

## Overview
This project has been configured for deployment on Cloudflare Pages, which is the recommended platform for React SPAs.

## Why Cloudflare Pages?
- **Optimized for SPAs**: Handles client-side routing perfectly
- **Global CDN**: Fast loading worldwide
- **Git Integration**: Automatic deployments from Git
- **Free Tier**: Generous free limits
- **Custom Domains**: Easy domain setup

## Deployment Methods

### Method 1: Git Integration (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Cloudflare Pages
3. Set build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave empty)

### Method 2: Wrangler CLI
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

## Environment Variables
Set these in Cloudflare Pages dashboard:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Configuration Files Added
- `wrangler.toml`: Cloudflare configuration
- `_redirects`: SPA routing support
- `public/_headers`: Security and caching headers

## Build Optimizations
- Code splitting for better performance
- Asset optimization
- Source maps for development
- Manual chunk splitting for vendor libraries

## Custom Domain Setup
1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. Add your domain
4. Update DNS records as instructed

## Monitoring
- View deployment logs in Cloudflare dashboard
- Monitor performance with Cloudflare Analytics
- Set up alerts for failed deployments

## Troubleshooting
- Ensure all environment variables are set
- Check build logs for errors
- Verify Supabase connection in production
- Test SPA routing after deployment

