# 🔧 Cloudflare Pages SPA Routing Fix

## Problem

When deploying a React SPA (Single Page Application) to Cloudflare Pages, you see a **blank page** because Cloudflare doesn't know how to handle client-side routing.

**Cause**: Cloudflare Pages expects each route to be a real file, not a virtual route handled by React Router.

## Solution

Add special Cloudflare Pages configuration files to the `public/` directory. Cloudflare automatically uses files starting with `_` to configure routing.

---

## 📁 Files Created

### 1. `public/_routes.json`

Tells Cloudflare Pages which routes exist and to serve them all from `index.html`.

```json
{
  "version": 1,
  "include": [
    "/*"              // Match all routes
  ],
  "exclude": [
    "/assets/*",        // Exclude static assets
    "/supabase/*"      // Exclude Supabase functions
  ]
}
```

### 2. `public/_headers`

Adds security headers and cache control.

```
/*\
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  # etc...
```

### 3. `public/404.html`

Fallback page that redirects to `index.html` for SPA routing.

---

## 🚀 Deployment Instructions

### Option A: Automated Script (Recommended)

```bash
# Make script executable
chmod +x deploy-cloudflare.sh

# Run deployment
./deploy-cloudflare.sh
```

### Option B: Manual Deployment

#### Step 1: Build
```bash
npm run build
```

#### Step 2: Verify Files in `dist/`

After building, Vite puts everything in `dist/`. Check that these files exist:

```bash
ls -la dist/_routes.json
ls -la dist/_headers
ls -la dist/404.html
ls -la dist/index.html
```

**If `_routes.json` is missing from `dist/`:**

Update your build script or Vite config to copy it:

**Update `package.json`:**
```json
{
  "scripts": {
    "build": "npm run build:vite && cp public/_routes.json dist/ && cp public/_headers dist/ && cp public/404.html dist/"
  }
}
```

Or manually copy:
```bash
cp public/_routes.json dist/
cp public/_headers dist/
cp public/404.html dist/
```

#### Step 3: Deploy

```bash
npx wrangler pages deploy dist --project-name=picture-prompt-generator --branch=main
```

Or using `wrangler` globally:
```bash
wrangler pages deploy dist --project-name=picture-prompt-generator --branch=main
```

---

## 🔍 Troubleshooting

### Still seeing a blank page?

1. **Wait 2-3 minutes** - Cloudflare's CDN takes time to propagate changes

2. **Hard refresh** your browser:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **Clear browser cache**:
   - Chrome: DevTools → Application → Clear storage
   - Firefox: Options → Privacy & Security → Clear History

4. **Check Cloudflare Dashboard**:
   - Go to: Pages → picture-prompt-generator
   - Verify files are deployed (check `_routes.json` exists)
   - Check deployment status (should be "Success")

5. **Check browser console** for errors:
   - Open DevTools (F12)
   - Look for 404 errors or file not found errors

6. **Verify `base` in Vite config**:
   - The build should work in subdirectory or root
   - Check that paths are correct

### Verify Files Are Deployed

Run this command to see what Cloudflare received:

```bash
npx wrangler pages deployment list --project-name=picture-prompt-generator
```

Or check the Cloudflare Dashboard directly:

1. Go to: https://dash.cloudflare.com → Pages
2. Select: `picture-prompt-generator`
3. Click: "View Build" or check deployments
4. Verify `_routes.json` is present
5. Verify `index.html` is present

### Check Router Configuration

Your React Router should use `createBrowserRouter`:

```typescript
// src/App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Index />} />
  </Routes>
</BrowserRouter>
```

This is already correctly set up in your code.

---

## ✅ Success Criteria

You'll know it's working when:

- [ ] Visiting any route (like `/login`) shows the page content
- [ ] Refreshing the page doesn't break routing
- [ ] Browser console shows no 404 errors
- [ ] All functionality works (login, image generation, etc.)

---

## 🎯 Quick Fix Commands

```bash
# One-line fix
npm run build && npx wrangler pages deploy dist --project-name=picture-prompt-generator --branch=main

# Or use the script
./deploy-cloudflare.sh
```

---

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/configuration/serving-single-page-apps/)
- [React Router on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site)

---

**Last Updated**: February 2026
**For**: PromptForge React SPA on Cloudflare Pages
