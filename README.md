# ❤️ LoveLetter — Modern Digital Love Letter Web App

A modern, romantic, database-free digital love-letter web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- **💌 Database-Free Architecture:** Entire letter state is compressed and safely encoded into the URL using `lz-string`. No accounts, no database, 100% serverless and private.
- **✉️ Animated Envelope Experience:** Interactive 3D folded envelope with custom wax seal, smooth unfolding animation, and romantic heart confetti burst.
- **📜 Handwritten Script Typography:** Powered by curated Google Fonts:
  - *Great Vibes*
  - *Dancing Script*
  - *Caveat*
  - *Pacifico*
  - *Playfair Display*
- **🎨 6 Romantic Themes:** Classic Love, Rose, Midnight Love, Blush, Minimal, Valentine's.
- **📄 5 Stationery Textures:** Parchment Paper, Soft Pink, Pure White, Romantic Sunset Gradient, and Floating Hearts Watermark.
- **👁️ Live Dual-Screen Preview:** Real-time side-by-side editing on desktop and tabbed responsive preview on mobile.
- **💾 LocalStorage Draft Persistence:** Automatically saves your draft (`love-letter-draft`) with confirmation modal to reset.
- **📄 Client-Side PDF Export:** Instant A4 portrait PDF generation using `html2canvas` and `jsPDF`.
- **🔗 1-Click Sharing:** Copy Link with toast feedback and native mobile Web Share API support.
- **🛡️ Secure & Accessible:** Zero `dangerouslySetInnerHTML`, runtime schema validation, sanitized inputs, keyboard navigation, and `prefers-reduced-motion` compliance.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```text
src/
├── app/
│   ├── page.tsx               # Romantic Landing Page with Hero & Features
│   ├── create/
│   │   └── page.tsx           # Letter Editor Page
│   ├── letter/
│   │   └── [id]/
│   │       └── page.tsx       # Recipient Dedicated Letter Route
│   ├── layout.tsx             # Root layout with Google Fonts & Background
│   └── globals.css            # Tailwind & Paper textures
│
├── components/
│   ├── landing/
│   │   ├── Hero.tsx           # Romantic Hero with CTAs & Open modal
│   │   └── Features.tsx       # Feature showcase & romance journey
│   ├── editor/
│   │   ├── LetterEditor.tsx   # Central editor orchestrator & draft recovery
│   │   ├── RecipientInput.tsx # To/From floating inputs
│   │   ├── LetterTitleInput.tsx
│   │   ├── LetterContentEditor.tsx # Alignment, font size & inspiration prompts
│   │   ├── FontSelector.tsx   # Script font selection cards
│   │   ├── ThemeSelector.tsx  # Palette & stationery selector
│   │   └── DecorationSelector.tsx # Hearts, roses, sparkles toggles
│   ├── letter/
│   │   ├── LetterPaper.tsx    # Stationery card component
│   │   ├── LetterPreview.tsx  # Live preview with zoom & PDF export
│   │   ├── Envelope.tsx       # 3D folding envelope & wax seal
│   │   └── Decorations.tsx    # Corner flourishes & floating heart particles
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── Button.tsx         # Romantic styled button variants
│       ├── Modal.tsx          # Accessible modal dialog
│       └── Toast.tsx          # Heart-accented floating toasts
│
├── lib/
│   ├── letter-encoder.ts      # LZ-String URL compression & Base64 fallback
│   ├── pdf-generator.ts       # Client-side html2canvas + jsPDF export
│   ├── local-storage.ts       # love-letter-draft auto-save/load/clear
│   └── validation.ts          # Runtime schema validation & sanitization
│
├── types/
│   └── letter.ts              # LoveLetter type definitions
│
└── config/
    ├── fonts.ts               # Google Fonts configuration
    └── themes.ts              # Romantic color palettes & backgrounds
```

---

## 🌐 Deployment

This application is fully compatible with **Vercel**, **Netlify**, or any static/serverless host. No environment variables, external services, or databases are required.
