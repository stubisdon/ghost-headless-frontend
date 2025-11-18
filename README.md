# Ghost Headless Frontend - Minimalistic Design

A minimalistic, custom frontend for Ghost CMS built with Next.js and TypeScript.

## Features

- ✅ **Minimalistic Design** - Clean, modern, and focused on content
- ✅ **TypeScript** - Type-safe development
- ✅ **Next.js 14** - Server-side rendering and static generation
- ✅ **Responsive** - Works beautifully on all devices
- ✅ **SEO Optimized** - Proper meta tags and Open Graph support
- ✅ **Fast** - Static generation with ISR (Incremental Static Regeneration)

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

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
ghost-headless-frontend-starter/
├── components/          # React components
│   ├── Header.tsx      # Site header with navigation
│   └── Footer.tsx      # Site footer
├── lib/
│   └── ghost-api.ts    # Ghost Content API client
├── pages/
│   ├── _app.tsx        # Next.js app wrapper
│   ├── index.tsx       # Homepage (post listing)
│   └── posts/
│       └── [slug].tsx  # Single post page
├── styles/
│   └── globals.css     # Global styles (minimalistic design)
├── next.config.js      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## Customization

### Colors

Edit `styles/globals.css` to change the color scheme:

```css
:root {
  --color-primary: #000;      /* Main text color */
  --color-secondary: #666;    /* Secondary text */
  --color-accent: #402b91;    /* Accent color (purple) */
  --color-bg: #fff;           /* Background */
  --color-border: #e5e5e5;    /* Borders */
}
```

### Typography

The design uses system fonts for optimal performance. To change:

```css
--font-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Layout

Adjust the max width in `styles/globals.css`:

```css
--max-width: 800px;  /* Content max width */
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to DigitalOcean.

**Quick deployment steps:**
1. Build the project: `npm run build`
2. Deploy to your server
3. Set up nginx reverse proxy
4. Configure SSL with Let's Encrypt
5. Update Ghost configuration

## API Endpoints Used

- `GET /ghost/api/content/posts/` - Get all posts
- `GET /ghost/api/content/posts/slug/{slug}/` - Get single post
- `GET /ghost/api/content/settings/` - Get site settings
- `GET /ghost/api/content/authors/` - Get authors
- `GET /ghost/api/content/tags/` - Get tags

## Features Implemented

- ✅ Homepage with post listing
- ✅ Single post pages
- ✅ Responsive navigation
- ✅ Image optimization (Next.js Image component)
- ✅ SEO meta tags
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Post excerpts
- ✅ Author information
- ✅ Tags display
- ✅ Minimalistic, clean design

## Next Steps

- [ ] Add pagination for posts
- [ ] Add author pages
- [ ] Add tag pages
- [ ] Add search functionality
- [ ] Add RSS feed
- [ ] Add dark mode (optional)
- [ ] Customize design further

## Troubleshooting

### API not working?
- Verify your API key is correct
- Check that Ghost is running: `ghost status`
- Test API endpoint directly in browser

### Build errors?
- Make sure all environment variables are set
- Check Node.js version (requires 18+)
- Clear `.next` folder and rebuild

### Images not loading?
- Verify image domains in `next.config.js`
- Check Ghost image URLs are accessible

## License

MIT

## Support

For issues or questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review Ghost API documentation
3. Check Next.js documentation
