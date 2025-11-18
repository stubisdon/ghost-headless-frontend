# Public Assets

Place your media files here:

## Required Files

### Audio File
- **Path:** `/public/audio/knock-knock.mp3`
- **Description:** Audio file that plays automatically when the site loads
- **Format:** MP3 (recommended) or other browser-supported audio formats

### Video File
- **Path:** `/public/video/intro.mp4`
- **Description:** Fullscreen video that plays when user clicks anywhere
- **Format:** MP4 (recommended) or WebM as fallback
- **Note:** You can also add a WebM version at `/public/video/intro.webm` for better browser compatibility

## File Structure

```
public/
├── audio/
│   └── knock-knock.mp3    ← Place your audio file here
├── video/
│   ├── intro.mp4          ← Place your video file here
│   └── intro.webm         ← Optional: WebM version
└── README.md
```

## How to Add Files

1. Create the directories if they don't exist:
   ```bash
   mkdir -p public/audio public/video
   ```

2. Copy your files:
   ```bash
   cp /path/to/your/audio.mp3 public/audio/knock-knock.mp3
   cp /path/to/your/video.mp4 public/video/intro.mp4
   ```

3. The files will be automatically served by Next.js at:
   - `/audio/knock-knock.mp3`
   - `/video/intro.mp4`

## File Size Recommendations

- **Audio:** Keep under 5MB for fast loading
- **Video:** Optimize for web (H.264 codec, reasonable resolution)
  - Recommended: 1080p or 720p
  - Consider compression to reduce file size

## Browser Compatibility

- **Audio:** MP3 works in all modern browsers
- **Video:** MP4 (H.264) works in all modern browsers
- For better compatibility, provide both MP4 and WebM versions

