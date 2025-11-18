# Ghost Headless Frontend - Immersive Black Screen Experience

An immersive, minimalistic black screen frontend for Ghost CMS built with Next.js and TypeScript.

## Features

- ✅ **Immersive Black Screen Design** - Black background with white monospace font
- ✅ **Auto-play Audio** - Background audio plays on load
- ✅ **YouTube Video Integration** - Fullscreen video experience
- ✅ **Interactive Form Flow** - Name → Contact → Message progression
- ✅ **Mobile Optimized** - Touch-friendly interactions
- ✅ **TypeScript** - Type-safe development
- ✅ **Next.js 14** - Server-side rendering and static generation

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and add your Ghost API credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
GHOST_API_URL=https://catsky.club/ghost/api/content
GHOST_CONTENT_API_KEY=your-content-api-key-here
NEXT_PUBLIC_SITE_URL=https://catsky.club
```

**Get your API key:**
1. Go to Ghost Admin → Settings → Integrations
2. Create a new Custom Integration
3. Copy the **Content API Key**

### 3. Add Media Files

```bash
# Add your audio file
cp /path/to/your/audio.mp3 public/audio/knock-knock.mp3
```

The video is currently set to use YouTube video `https://www.youtube.com/watch?v=8wU8k2kDaTo`. To change it, edit `YOUTUBE_VIDEO_ID` in `pages/index.tsx`.

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

## User Experience Flow

1. **Intro Screen**: Black screen with "knock knock 🐾" and auto-play audio
2. **Click Anywhere**: YouTube video plays fullscreen
3. **After Video**: "who are you?" input field appears
4. **Enter Name**: Shows "hello, [name]" + contact field
5. **Enter Contact**: Final message screen with submission

## Project Structure

```
ghost-headless-frontend-starter/
├── components/          # React components
│   ├── Header.tsx      # Site header (not used in immersive mode)
│   └── Footer.tsx      # Site footer (not used in immersive mode)
├── lib/
│   └── ghost-api.ts    # Ghost Content API client
├── pages/
│   ├── _app.tsx        # Next.js app wrapper
│   ├── index.tsx       # Main immersive experience
│   ├── api/
│   │   └── submit.ts   # Form submission endpoint
│   └── posts/
│       └── [slug].tsx  # Single post page (optional)
├── styles/
│   └── globals.css     # Global styles (black screen design)
├── public/
│   └── audio/          # Audio files directory
├── types/
│   └── youtube.d.ts    # YouTube API type definitions
├── next.config.js      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## Customization

### Change YouTube Video

Edit `pages/index.tsx`:
```typescript
const YOUTUBE_VIDEO_ID = 'your-video-id-here'
```

### Colors & Typography

Edit `styles/globals.css`:
```css
:root {
  --color-bg: #000000;      /* Background color */
  --color-text: #ffffff;    /* Text color */
  --font-mono: 'Courier New', Courier, monospace;
}
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to DigitalOcean.

## API Endpoints

- `GET /ghost/api/content/posts/` - Get all posts
- `GET /ghost/api/content/posts/slug/{slug}/` - Get single post
- `GET /ghost/api/content/settings/` - Get site settings
- `POST /api/submit` - Submit contact form

## Troubleshooting

### Audio not playing?
- Some browsers block autoplay. User may need to interact first.
- Check browser console for errors.
- Verify file path: `/audio/knock-knock.mp3`

### Video not playing?
- Check browser console for errors.
- Verify YouTube video ID is correct in `pages/index.tsx`.
- Ensure YouTube video is publicly accessible.
- Check internet connection (YouTube video requires connection).

### Fullscreen not working?
- Some browsers require user interaction before allowing fullscreen.
- Mobile browsers may handle fullscreen differently.
- The video will still play even if fullscreen fails.

## License

MIT

## Support

For issues or questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review Ghost API documentation
3. Check Next.js documentation
