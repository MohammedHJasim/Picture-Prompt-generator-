# PromptForge

AI-powered image generation with Google Gemini and Supabase authentication.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Security Features

- **Single Account Access**: Only one email can access the app
- **Server-Side API Keys**: Gemini API key never exposed to frontend
- **Protected Routes**: All pages require authentication
- **No Sign-Ups**: Prevents unauthorized account creation

See [SECURITY.md](SECURITY.md) for detailed security information.

## 📦 Deployment

**⚠️ IMPORTANT**: Before deploying, read [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Environment variable setup
- Supabase Edge Functions configuration
- Production security checklist

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Auth**: Supabase Authentication (single account system)
- **AI**: Google Gemini API (via Supabase Edge Functions)
- **Database**: Supabase PostgreSQL
- **State Management**: React hooks + TanStack Query

## 📁 Project Structure

```
prompt-canvas-main/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom hooks (useAuth, usePromptForge)
│   ├── integrations/       # Supabase client
│   ├── lib/                # Utilities
│   └── pages/              # Page components
├── supabase/
│   └── functions/          # Edge Functions (server-side)
│       ├── generate-prompt/  # AI prompt generation
│       └── generate-image/   # AI image generation
└── public/                 # Static assets
```

## 🎨 Features

- **AI Prompt Generation**: Enhanced prompts with style, mood, lighting, etc.
- **AI Image Generation**: Create images from text prompts using Gemini
- **Editable Prompts**: Modify and regenerate images with edited prompts
- **Single Account System**: Secure access control with email whitelist
- **Responsive Design**: Works on desktop and mobile

## ⚙️ Configuration

### Environment Variables

Required for development (`.env`):

```bash
# Supabase
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"

# Single Account Access
VITE_ALLOWED_EMAIL="your-email@example.com"

# Gemini API (for local development only - use Supabase secrets in production!)
GEMINI_API_KEY="your-gemini-api-key"
```

See `.env.example` for template.

## 🔑 API Keys

### Getting Keys

**Gemini API Key**:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. For production: Add to Supabase Edge Functions secrets
4. For development: Add to local `.env` file

**Supabase Credentials**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Copy URL and anon key from Project Settings

## 📄 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 🔒 Important Security Notes

### ❌ NEVER Commit to Git:
- `.env` files
- Any API keys
- Passwords or secrets
- Backend credentials

### ✅ ALWAYS Verify:
- `.env` is in `.gitignore`
- `GEMINI_API_KEY` is ONLY in Supabase Edge Functions secrets for production
- `VITE_ALLOWED_EMAIL` is correctly set for production environment
- No hardcoded secrets in source code

### 🔐 Production Deployment:
1. Set `VITE_ALLOWED_EMAIL` in hosting platform
2. Set `GEMINI_API_KEY` in Supabase Dashboard → Edge Functions → Secrets
3. Deploy Edge Functions first, then frontend
4. Test authentication with authorized email only

## 📚� Quick Deploy

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel Dashboard.

### Netlify

```bash
npm run build
netlify deploy --prod
```

Set environment variables in Netlify Dashboard.

### Cloudflare Pages

```bash
npm run build
npx wrangler pages publish dist
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

## 🧪 Testing

```bash
npm run test
```

## 📝 License

This project is private and proprietary.

## 🆘 Support & Troubleshooting

For deployment or security issues:
1. **Security Issues**: See [SECURITY.md](SECURITY.md)
2. **Deployment Help**: See [DEPLOYMENT.md](DEPLOYMENT.md)
3. **API Problems**: Check Supabase Dashboard → Edge Functions → Logs
4. **Auth Issues**: Check Supabase Dashboard → Authentication → Users

## Development Workflow

1. Make changes to source code
2. Test locally with `npm run dev`
3. Build with `npm run build`
4. Deploy to hosting platform
5. Set environment variables in platform dashboard
6. Deploy Edge Functions separately if needed
7. Test production deployment

---

**Made with ❤️ using AI and modern web technologies**
