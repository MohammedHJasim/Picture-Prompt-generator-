# 🚀 Production Deployment Checklist

Use this checklist when deploying PromptForge to production.

## Pre-Deployment

### Environment Variables

- [ ] **`VITE_SUPABASE_PROJECT_ID`** set in hosting platform
- [ ] **`VITE_SUPABASE_PUBLISHABLE_KEY`** set in hosting platform
- [ ] **`VITE_SUPABASE_URL`** set in hosting platform
- [ ] **`VITE_ALLOWED_EMAIL`** set to production email address
- [ ] `GEMINI_API_KEY` added to Supabase Edge Functions secrets (NOT in .env)

### Security Verification

- [ ] `.env` file is in `.gitignore`
- [ ] No API keys in source code
- [ ] `GEMINI_API_KEY` is NOT in frontend environment variables
- [ ] Only authorized email can access the app
- [ ] Sign-up functionality removed/disabled

### Edge Functions

- [ ] `generate-prompt` function deployed to Supabase
- [ ] `generate-image` function deployed to Supabase
- [ ] `GEMINI_API_KEY` secret added in Supabase Dashboard
- [ ] Functions tested and working

### Testing

- [ ] Login with authorized email works
- [ ] Login with unauthorized email fails
- [ ] Prompt generation works
- [ ] Image generation works
- [ ] Logout works and redirects to login
- [ ] Mobile responsive design tested
- [ ] Browser console shows no errors

## Deployment Steps

### 1. Deploy Edge Functions

```bash
cd supabase/functions
supabase functions deploy generate-prompt
supabase functions deploy generate-image
```

Verify in Supabase Dashboard → Edge Functions.

### 2. Set Supabase Secrets

1. Go to Supabase Dashboard
2. Navigate to: Edge Functions → Secrets
3. Add secret: `GEMINI_API_KEY`
4. Paste your Gemini API key
5. Save

### 3. Build Frontend

```bash
npm run build
```

### 4. Deploy Frontend

**For Vercel:**
```bash
npm i -g vercel
vercel --prod
```

**For Netlify:**
```bash
npm run build
netlify deploy --prod
```

**For Cloudflare Pages:**
```bash
npm run build
npx wrangler pages publish dist
```

### 5. Set Environment Variables

In your hosting platform dashboard, add:

```bash
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_ALLOWED_EMAIL=your-email@example.com
```

⚠️ **Do NOT add `GEMINI_API_KEY` here!** It goes in Supabase Edge Functions secrets only.

## Post-Deployment Verification

### Access the deployed site and test:

- [ ] Site loads without errors
- [ ] Redirects to `/login` when not authenticated
- [ ] Login page displays correctly
- [ ] Can log in with authorized email
- [ ] Unauthorized emails cannot log in
- [ ] After login, main app loads
- [ ] Prompt generation works
- [ ] Image generation works
- [ ] Images display correctly
- [ ] Logout button works
- [ ] After logout, redirects to login

### Monitor Logs

Check these for errors in first 24 hours:

- [ ] Hosting platform logs (Vercel/Netlify/Cloudflare)
- [ ] Supabase Dashboard → Edge Functions → Logs
- [ ] Browser console for JavaScript errors
- [ ] Supabase Dashboard → Authentication → Users

### Performance

- [ ] Page load times are acceptable
- [ ] API response times are acceptable
- [ ] Images generate within reasonable time
- [ ] No memory leaks in browser console

## Rollback Plan

If deployment fails:

1. **Check logs** in hosting platform and Supabase
2. **Verify secrets** are correctly set
3. **Test locally** with production environment variables
4. **Redeploy functions** if API keys changed
5. **Revert to last working commit** if needed

## Common Issues & Solutions

### Issue: "Access denied"
**Cause**: `VITE_ALLOWED_EMAIL` doesn't match login email
**Fix**: Update email in hosting platform environment variables

### Issue: "GEMINI_API_KEY is not configured"
**Cause**: Secret not set in Supabase Edge Functions
**Fix**: Add secret in Supabase Dashboard → Edge Functions → Secrets

### Issue: Images not generating
**Cause**: Edge Functions not deployed or API quota exceeded
**Fix**:
- Check Supabase Dashboard → Functions → Logs
- Verify Gemini API quota
- Redeploy functions if needed

### Issue: Auth redirects not working
**Cause**: Environment variable not loaded correctly
**Fix**:
- Clear hosting platform cache
- Redeploy frontend
- Check variable names match exactly

## Success Criteria

✅ **Deployment is successful when:**
- All pre-deployment checks passed
- All deployment steps completed
- All post-deployment verifications passed
- No critical errors in logs
- Real users can access and use the app

---

**Last Updated**: February 2026
**Version**: 1.0.0
