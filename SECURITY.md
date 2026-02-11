# Security & Deployment Guide

## 🔒 Security Architecture

This application implements multiple layers of security:

### 1. **Single Account Access Control**
- Only one email address can access the application
- Configured via `VITE_ALLOWED_EMAIL` environment variable
- Fallback hardcoded value for development (DO NOT use in production)

### 2. **Server-Side API Keys**
- `GEMINI_API_KEY` is **NEVER** exposed to the frontend
- All AI API calls go through Supabase Edge Functions
- Keys stored in Supabase Edge Functions secrets

### 3. **Protected Routes**
- All pages require authentication
- Auto-redirect to `/login` if not authenticated
- Additional authorization check ensures user is the allowed account

### 4. **No Public Sign-Up**
- Sign-up functionality has been removed
- Only the pre-configured email can log in
- Prevents unauthorized account creation

---

## 🔑 Secret Management

### Client-Side Environment Variables
These are safe to expose (used by React):

```bash
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_ALLOWED_EMAIL="admin@example.com"
```

### Server-Side Secrets (NEVER commit to git)
These must be set in Supabase Edge Functions:

```
GEMINI_API_KEY=AIzaSy...  # Gemini API key
```

⚠️ **CRITICAL**: Never add `GEMINI_API_KEY` to `.env` file in production!

---

## 🚀 Quick Deploy

### 1. Prepare Environment Variables

In your hosting platform (Vercel/Netlify/etc.), set:

```bash
VITE_ALLOWED_EMAIL="your-actual-email@example.com"
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

### 2. Deploy Edge Functions

```bash
# From project root
cd supabase/functions

# Deploy both functions
supabase functions deploy generate-prompt
supabase functions deploy generate-image
```

### 3. Set Server Secrets in Supabase

1. Go to https://supabase.com/dashboard
2. Navigate to: Edge Functions → Secrets
3. Add secret: `GEMINI_API_KEY` = your key
4. Save and redeploy functions if needed

### 4. Deploy Frontend

```bash
# Build
npm run build

# Deploy to your platform
vercel --prod
# or
netlify deploy --prod
```

---

## ✅ Pre-Deploy Checklist

- [ ] Updated `VITE_ALLOWED_EMAIL` to production email
- [ ] Set `GEMINI_API_KEY` in Supabase Edge Functions secrets
- [ ] Deployed both Edge Functions (`generate-prompt`, `generate-image`)
- [ ] Verified `.env` is in `.gitignore`
- [ ] Tested login with authorized email
- [ ] Tested that unauthorized emails are rejected
- [ ] Checked Supabase Dashboard for any auth issues
- [ ] (Optional) Disabled sign-ups in Supabase Dashboard

---

## 🧪 Security Best Practices

### Git Safety

**NEVER commit:**
- `.env` files
- API keys
- Passwords
- Secrets

**Always keep in `.gitignore`:**
```
.env
.env.*
*.local
```

### Supabase Best Practices

1. **Enable Row Level Security (RLS)**
   - Go to Database → Tables
   - Enable RLS on all tables
   - Add policies to restrict data access

2. **Disable Unused Features**
   - Authentication → Providers → Disable email signups
   - Only allow password-based auth for your account

3. **Monitor Function Logs**
   - Regularly check Edge Functions → Logs
   - Look for suspicious activity
   - Monitor API quota usage

### Environment Variables

**Development (`.env`):**
```bash
# Safe for local development
GEMINI_API_KEY=your-key
ALLOWED_EMAIL=you@example.com
```

**Production (Hosting Platform):**
```bash
# Set these in your hosting dashboard
VITE_ALLOWED_EMAIL=you@example.com
# Never put GEMINI_API_KEY here!
```

**Supabase Edge Functions (Dashboard):**
```
GEMINI_API_KEY=your-key
# Only place for server-side secrets!
```

---

## 🔍 Troubleshooting

### Issue: "Access denied"
**Solution**: Update `VITE_ALLOWED_EMAIL` to match your login email

### Issue: "GEMINI_API_KEY is not configured"
**Solution**: Add the key in Supabase Dashboard → Edge Functions → Secrets

### Issue: Images not generating
**Solution**:
1. Check Edge Functions are deployed
2. Verify API key is valid
3. Check Supabase function logs for errors

### Issue: Unauthorized users can access
**Solution**:
1. Verify `ALLOWED_EMAIL` is set correctly
2. Check Index.tsx authorization check is working
3. Clear browser cache and localStorage

---

## 📞 Support

For deployment or security issues:
1. Check `DEPLOYMENT.md` for detailed guide
2. Review Supabase Dashboard logs
3. Check Edge Functions logs for API errors
4. Verify environment variables are set correctly

---

## 🔄 Rotating Secrets

If your API key is compromised:

1. **Generate new key** at https://aistudio.google.com/app/apikey
2. **Update in Supabase** Dashboard → Edge Functions → Secrets
3. **Redeploy functions** to apply new key
4. **Delete old key** from Google AI Studio

**Never share old keys or commit them to git.**
