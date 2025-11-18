# Setting Up Your Media Files

## Quick Setup

1. **Add your audio file:**
   ```bash
   cp /path/to/your/audio.mp3 public/audio/knock-knock.mp3
   ```

2. **Video is using YouTube:** The video is currently set to use the YouTube video at `https://www.youtube.com/watch?v=8wU8k2kDaTo`. No local video file needed!

That's it! The audio file will be automatically loaded when the site runs.

## File Requirements

### Audio File (`knock-knock.mp3`)
- **Location:** `public/audio/knock-knock.mp3`
- **Format:** MP3 (recommended) or any browser-supported audio format
- **Size:** Keep under 5MB for fast loading
- **Behavior:** Plays automatically when the site loads (may require user interaction on some browsers due to autoplay policies)

### Video (YouTube)
- **Current:** Using YouTube video `https://www.youtube.com/watch?v=8wU8k2kDaTo`
- **Behavior:** Plays fullscreen when user clicks anywhere on the intro screen
- **To change:** Edit `YOUTUBE_VIDEO_ID` in `pages/index.tsx` (extract the video ID from the YouTube URL)

## Testing

After adding your files:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit:** `http://localhost:3000`

3. **You should:**
   - See "knock knock 🐾" in the center
   - Hear audio playing (if autoplay is allowed)
   - Click anywhere to trigger the video
   - Video should go fullscreen

## Troubleshooting

### Audio not playing?
- Some browsers block autoplay. User may need to interact first.
- Check browser console for errors.
- Verify file path: `/audio/knock-knock.mp3`

### Video not playing?
- Check browser console for errors.
- Verify YouTube video ID is correct in `pages/index.tsx`.
- Ensure YouTube video is publicly accessible (not private/unlisted).
- Check internet connection (YouTube video requires connection).

### Fullscreen not working?
- Some browsers require user interaction before allowing fullscreen.
- Mobile browsers may handle fullscreen differently.
- The video will still play even if fullscreen fails.

## File Structure

```
public/
├── audio/
│   └── knock-knock.mp3    ← Your audio file
└── README.md

Note: Video is loaded from YouTube, no local video file needed.
```

