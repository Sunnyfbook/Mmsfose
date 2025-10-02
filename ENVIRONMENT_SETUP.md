# Environment Variables Setup

## Supabase Configuration

Your project is configured to use these Supabase environment variables:

### Required Environment Variables:
```bash
VITE_SUPABASE_URL=https://lbmortayknpfqkpwuvmy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibW9ydGF5a25wZnFrcHd1dm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNDEwNDAsImV4cCI6MjA3NDcxNzA0MH0.eAP10gVsLHClw6TC1akinRdSqa9ymWGa0e2kQX6UCDI
```

## Local Development Setup

1. **Create `.env` file** in your project root:
```bash
# Copy the variables above into a .env file
VITE_SUPABASE_URL=https://lbmortayknpfqkpwuvmy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibW9ydGF5a25wZnFrcHd1dm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNDEwNDAsImV4cCI6MjA3NDcxNzA0MH0.eAP10gVsLHClw6TC1akinRdSqa9ymWGa0e2kQX6UCDI
```

## Cloudflare Pages Deployment

When deploying to Cloudflare Pages, set these environment variables in the Cloudflare dashboard:

1. Go to **Cloudflare Dashboard** → **Pages** → **Your Project**
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

### Production Environment:
- **Variable**: `VITE_SUPABASE_URL`
- **Value**: `https://lbmortayknpfqkpwuvmy.supabase.co`

- **Variable**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibW9ydGF5a25wZnFrcHd1dm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNDEwNDAsImV4cCI6MjA3NDcxNzA0MH0.eAP10gVsLHClw6TC1akinRdSqa9ymWGa0e2kQX6UCDI`


## Admin User Setup

To access the admin panel, you need to create an admin user in Supabase:

1. **Go to Supabase Dashboard** → Authentication → Users
2. **Create a new user** or invite an existing user
3. **Set up Row Level Security (RLS)** for admin access:
   ```sql
   -- Enable RLS on admin tables
   ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
   ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
   ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE content_settings ENABLE ROW LEVEL SECURITY;
   
   -- Create admin policy (adjust as needed)
   CREATE POLICY "Admin access" ON videos FOR ALL USING (auth.role() = 'authenticated');
   ```

## Verification

After setting up the environment variables:

1. **Local Development**:
   ```bash
   npm run dev
   ```

2. **Build Test**:
   ```bash
   npm run build
   ```

3. **Check Supabase Connection**:
   - Open browser dev tools
   - Check Network tab for Supabase API calls
   - Verify no CORS errors

4. **Test Admin Authentication**:
   - Go to `/admin` route
   - Sign in with your Supabase user credentials
   - Verify access to admin dashboard

## Security Notes

- The `VITE_SUPABASE_ANON_KEY` is safe to expose in frontend code
- It's designed for client-side use with Row Level Security (RLS)
- Never expose your Supabase service role key in frontend code
- Admin access is controlled through Supabase Auth + RLS policies
