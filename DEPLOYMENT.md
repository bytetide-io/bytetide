# ByteTide Deployment Guide

## Authentication Redirect Configuration

### 🔧 Environment Variables

For production deployment, you **MUST** set the following environment variable:

```bash
# Replace with your actual production domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 📋 Production Setup Checklist

#### 1. Environment Variables
Copy `.env.production.example` to `.env.production` and update:

```bash
# Required for authentication redirects
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 2. Supabase Authentication Settings

In your Supabase Dashboard → Authentication → Settings:

**Site URL:**
```
https://yourdomain.com
```

**Redirect URLs (Add these):**
```
https://yourdomain.com/auth/callback
https://yourdomain.com/onboarding
https://yourdomain.com/auth/reset-password
```

#### 3. Deployment Platform Configuration

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_APP_URL
# Enter: https://yourdomain.com
```

**Netlify:**
```bash
# In netlify.toml or dashboard
NEXT_PUBLIC_APP_URL = "https://yourdomain.com"
```

**Other platforms:**
Set the environment variable according to your platform's documentation.

### 🚀 How It Works

The authentication system now uses a smart URL resolver:

1. **Development**: Uses `http://localhost:3000`
2. **Production**: Uses `NEXT_PUBLIC_APP_URL` environment variable
3. **Fallback**: Falls back to `window.location.origin` as last resort

### ⚠️ Critical Notes

1. **Domain Consistency**: The `NEXT_PUBLIC_APP_URL` must match:
   - Your actual deployed domain
   - Supabase Site URL setting
   - All redirect URLs in Supabase

2. **Email Links**: User registration and password reset emails will redirect to the production domain.

3. **Testing**: After deployment, test:
   - User registration (email confirmation)
   - Password reset flow
   - Invitation acceptance

### 🐛 Troubleshooting

**"Invalid redirect URL" errors:**
- Verify `NEXT_PUBLIC_APP_URL` matches your domain exactly
- Check Supabase redirect URL settings
- Ensure no trailing slashes in URLs

**Localhost redirects in production:**
- Environment variable not set or incorrect
- Build cache issues (try rebuilding)

### 🔄 Authentication Flow

1. **Registration**: `yourdomain.com` → Email → `yourdomain.com/onboarding`
2. **Password Reset**: `yourdomain.com` → Email → `yourdomain.com/auth/reset-password`
3. **Login**: Direct redirect to dashboard (no email required)

---

## Custom CSV Upload Feature

The custom CSV upload feature is production-ready and uses:
- Existing `projects` storage bucket
- Path structure: `projects/{project-id}/{timestamp}-{filename}.csv`
- Full authentication and authorization
- Compatible with existing file management

No additional configuration required for the CSV upload feature.