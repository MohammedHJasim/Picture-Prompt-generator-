# Deployment Guide - PromptForge

## Security Overview

This application uses a secure, single-account authentication system with Google Gemini API integration.

### Security Architecture

- **Frontend**: Supabase Auth (client-side)
- **API Calls**: Supabase Edge Functions (server-side)
- **AI Provider**: Google Gemini API
- **Access Control**: Single email whitelist

---

## Pre-Deployment Checklist

### 1. Environment Variables

#### Frontend (Client-Side) - Set in Hosting Platform:

```bash
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_ALLOWED_EMAIL="your-authorized-email@example.com"
```

#### Backend (Server-Side) - Set in Supabase Dashboard:

Go to: **Supabase Dashboard → Edge Functions → Secrets**

Add these secrets:
```
GEMINI_API_KEY=AIzaSy...  # Your Gemini API key
```

⚠️ **CRITICAL**: Never expose `GEMINI_API_KEY` to frontend!

### 2. Configure Allowed Email

**Option A: Environment Variable (Recommended for Production)**
```bash
# In your hosting platform (Vercel, Netlify, etc.)
VITE_ALLOWED_EMAIL="you@example.com"
```

**Option B: Hardcoded (Development Only)**
Edit `src/hooks/useAuth.tsx` line 8:
```typescript
const ALLOWED_EMAIL = "you@example.com";
```

### 3. Supabase Setup

1. **Disable Sign-Ups** (Recommended)
   - Go to Supabase Dashboard → Authentication → Providers
   - Disable "Allow new users to sign up"
   - Ensure "Enable email confirmations" is ON

2. **Set Up Edge Functions Secrets**
   - Navigate to Edge Functions in Supabase Dashboard
   - Add `GEMINI_API_KEY` secret
   - Deploy both functions:
     - `generate-prompt`
     - `generate-image`

### 4. Deploy Edge Functions

```bash
# From the supabase/functions directory
supabase functions deploy generate-prompt
supabase functions deploy generate-image
```

Or use the Supabase Dashboard UI to deploy.

---

## Deployment Platforms

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard:
# - VITE_SUPABASE_PROJECT_ID
# - VITE_SUPABASE_PUBLISHABLE_KEY
# - VITE_SUPABASE_URL
# - VITE_ALLOWED_EMAIL
```

### Netlify

```bash
# Build
npm run build

# Deploy
netlify deploy --prod

# Set environment variables in Netlify Dashboard
```

### Cloudflare Pages

```bash
# Build
npm run build

# Deploy with Wrangler
npx wrangler pages publish dist
```

---

## Production Security Checklist

- [ ] `.env` file is NOT committed to git
- [ ] `GEMINI_API_KEY` is in Supabase Edge Functions secrets only
- [ ] `VITE_ALLOWED_EMAIL` is set to production email
- [ ] Supabase sign-ups are disabled (optional but recommended)
- [ ] Edge Functions are deployed
- [ ] Tested login with authorized email
- [ ] Tested that unauthorized emails are rejected
- [ ] Cloudflare Access (or similar) is enabled

---

## Post-Deployment Verification

### 1. Test Authentication
- Visit your deployed site
- Should redirect to `/login`
- Try logging in with authorized email → Should work
- Try logging in with different email → Should fail

### 2. Test AI Features
- Generate a prompt → Should work
- Generate an image → Should work
- Check browser console for API errors

### 3. Test Edge Functions
- Check Supabase Dashboard → Edge Functions → Logs
- Verify functions are being called
- Check for any API key errors

---

## Troubleshooting

### "GEMINI_API_KEY is not configured"
**Cause**: API key not set in Supabase Edge Functions secrets
**Fix**: Add `GEMINI_API_KEY` in Supabase Dashboard → Edge Functions

### "Access denied. This account is not authorized."
**Cause**: Email doesn't match `ALLOWED_EMAIL`
**Fix**: Update `VITE_ALLOWED_EMAIL` environment variable or edit `src/hooks/useAuth.tsx`

### Images not generating
**Cause**: Edge Functions not deployed or API key invalid
**Fix**:
1. Check Supabase Edge Functions logs
2. Verify API key is valid
3. Check model names in Edge Functions match available Gemini models

---

## File Structure (Git)

**Files to commit:**
- All source code in `src/`
- `package.json`, `vite.config.ts`, `tsconfig.json`, etc.

**Files to NEVER commit:**
- `.env` (contains secrets!)
- `.env.local`
- `node_modules/`
- `dist/`

**Verify `.gitignore`:**
```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
dist-ssr/

# Environment files
.env
.env.local
.env.production

# Logs
*.log

# IDE
.vscode/
.idea/
*.sw?
.DS_Store
```

---

## API Key Sources

### Gemini API Key
Get yours at: https://aistudio.google.com/app/apikey

### Supabase Credentials
Get yours at: https://supabase.com/dashboard

---

## Support

For issues with:
- **Authentication**: Check Supabase Dashboard logs
- **Edge Functions**: Check Supabase Edge Functions logs
- **Deployment**: Check hosting platform logs
- **API Keys**: Verify keys are correct and not expired
