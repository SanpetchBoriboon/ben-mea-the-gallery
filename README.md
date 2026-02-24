# Ben & Mae — The Gallery

Wedding gallery web app built with Next.js 16, React 19, and Tailwind CSS v4.

---

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**
- **ESLint + Prettier**

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/SanpetchBoriboon/ben-mea-the-gallery.git
cd ben-mea-the-gallery
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์:

```bash
cp .env.production .env.local
```

แก้ค่าใน `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 4. Run dev server

```bash
npm run dev
```

เปิด [http://localhost:8080](http://localhost:8080) ในเบราว์เซอร์

---

## Environment Variables

| Variable                   | Description              | Example                                       |
| -------------------------- | ------------------------ | --------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL ของ backend API | `https://wedding-card-online-service.fly.dev` |

---

## Available Scripts

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Build for production
npm run start        # Start production server (port 8080)
npm run type-check   # TypeScript type check
npm run lint:check   # ESLint check
npm run lint         # ESLint auto-fix
npm run format       # Prettier auto-format
npm run format:check # Prettier check
```

---

## Deploy to Fly.io

### Prerequisites

```bash
# ติดตั้ง flyctl
brew install flyctl

# หรือ
curl -L https://fly.io/install.sh | sh
```

### 1. Login

```bash
fly auth login
```

### 2. สร้าง Fly app (ครั้งแรกเท่านั้น)

```bash
fly launch
```

> เลือก **No** เมื่อถามว่าต้องการ deploy ทันที เพื่อ set secrets ก่อน

### 3. Set environment secrets

```bash
fly secrets set NEXT_PUBLIC_API_BASE_URL=https://wedding-card-online-service.fly.dev
```

### 4. Deploy

```bash
fly deploy
```

### 5. เปิด browser

```bash
fly open
```

---

## Deploy to Vercel (Alternative)

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable บน Vercel dashboard หรือ CLI
vercel env add NEXT_PUBLIC_API_BASE_URL
```

---

## Project Structure

```
app/
├── components/
│   └── GalleryHeader.tsx   # Global header with dropdown navigation
├── album/
│   └── page.tsx            # Album page — postcard grid layout
├── wishes/
│   └── page.tsx            # Wishes page — polaroid card layout
├── photographer/
│   └── page.tsx            # Photographer page — gallery layout
├── api/
│   ├── images/route.ts     # Images API route
│   └── cards/route.ts      # Cards API route
├── page.tsx                # Homepage — auto-sliding background
├── layout.tsx              # Root layout (Kanit font)
└── globals.css             # Global styles
```

---

## Pages

| Path            | Description                                   |
| --------------- | --------------------------------------------- |
| `/`             | Homepage พร้อม auto-sliding background        |
| `/wishes`       | คำอวยพร — polaroid card grid พร้อม pagination |
| `/album`        | อัลบัม — postcard grid พร้อม modal            |
| `/photographer` | รูปจากช่างภาพ                                 |
