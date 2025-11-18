import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { getSiteSettings, GhostSettings } from '@/lib/ghost-api'

interface HomeProps {
  settings: GhostSettings
}

type Stage = 'intro' | 'video' | 'name' | 'contact' | 'message'

// YouTube video ID from the URL
const YOUTUBE_VIDEO_ID = '8wU8k2kDaTo'

export default function Home({ settings }: HomeProps) {
  const [stage, setStage] = useState<Stage>('intro')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [youtubeReady, setYoutubeReady] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const youtubePlayerRef = useRef<YT.Player | null>(null)
  const youtubeContainerRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const contactInputRef = useRef<HTMLInputElement>(null)

  // Load YouTube API
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).YT) {
      setYoutubeReady(true)
    }
  }, [])

  // Initialize YouTube player when API is ready
  useEffect(() => {
    if (youtubeReady && stage === 'video' && youtubeContainerRef.current && !youtubePlayerRef.current) {
      youtubePlayerRef.current = new (window as any).YT.Player(youtubeContainerRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          fs: 1, // Allow fullscreen
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            // Try to enter fullscreen
            const iframe = youtubeContainerRef.current?.querySelector('iframe')
            if (iframe && iframe.requestFullscreen) {
              iframe.requestFullscreen().catch(() => {
                // Fullscreen may require user interaction
                console.log('Fullscreen not available')
              })
            }
            event.target.playVideo()
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            // Video ended
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              handleVideoEnd()
            }
          },
        },
      })
    }
  }, [youtubeReady, stage])

  // Auto-play audio on mount
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      // Try to play audio (may require user interaction on some browsers)
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            // Auto-play was prevented, user will need to interact
            console.log('Audio autoplay prevented:', error)
          })
      }
    }
  }, [])

  // Handle click anywhere to show video
  const handleScreenClick = () => {
    if (stage === 'intro') {
      setStage('video')
    }
  }

  // Handle video end
  const handleVideoEnd = () => {
    // Clean up YouTube player
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.destroy()
      youtubePlayerRef.current = null
    }
    
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
    
    setStage('name')
    // Focus name input
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 300)
  }

  // Handle name submission
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setStage('contact')
      setTimeout(() => {
        contactInputRef.current?.focus()
      }, 300)
    }
  }

  // Handle contact submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (contact.trim()) {
      // Submit to API endpoint
      try {
        await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, contact }),
        })
      } catch (error) {
        console.error('Submission error:', error)
      }
      
      setStage('message')
    }
  }

  return (
    <>
      <Head>
        <title>{settings.title}</title>
        <meta name="description" content={settings.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href={settings.icon || '/favicon.ico'} />
      </Head>

      {/* YouTube IFrame API */}
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined') {
            // Set up the callback
            (window as any).onYouTubeIframeAPIReady = () => {
              setYoutubeReady(true)
            }
            // Check if API is already loaded
            const checkYT = setInterval(() => {
              if ((window as any).YT && (window as any).YT.Player) {
                setYoutubeReady(true)
                clearInterval(checkYT)
              }
            }, 100)
            // Cleanup after 5 seconds
            setTimeout(() => clearInterval(checkYT), 5000)
          }
        }}
      />

      {/* Hidden audio player */}
      <audio
        ref={audioRef}
        src="/audio/knock-knock.mp3"
        loop
        preload="auto"
      />

      {/* Main container */}
      <div 
        className={`app-container ${stage}`}
        onClick={handleScreenClick}
        style={{ cursor: stage === 'intro' ? 'pointer' : 'default' }}
      >
        {/* Intro Stage */}
        {stage === 'intro' && (
          <div className="intro-screen">
            <div className="knock-knock">
              knock knock <span className="paw">🐾</span>
            </div>
            {!isPlaying && (
              <div className="audio-hint">
                Click anywhere to begin
              </div>
            )}
          </div>
        )}

        {/* Video Stage */}
        {stage === 'video' && (
          <div className="video-container">
            <div 
              ref={youtubeContainerRef}
              id="youtube-player"
              className="youtube-player"
            />
          </div>
        )}

        {/* Name Input Stage */}
        {stage === 'name' && (
          <div className="form-screen">
            <form onSubmit={handleNameSubmit} className="name-form">
              <label htmlFor="name" className="form-label">
                who are you?
              </label>
              <input
                ref={nameInputRef}
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder=""
                autoFocus
                autoComplete="off"
              />
              <button type="submit" className="submit-button">
                <span className="desktop-text">enter</span>
                <span className="mobile-icon">→</span>
              </button>
            </form>
          </div>
        )}

        {/* Contact Input Stage */}
        {stage === 'contact' && (
          <div className="form-screen">
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="greeting">hello, {name}</div>
              <label htmlFor="contact" className="form-label">
                how can i reach you?
              </label>
              <input
                ref={contactInputRef}
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="form-input"
                placeholder="email or phone"
                autoFocus
                autoComplete="off"
              />
              <button type="submit" className="submit-button">
                <span className="desktop-text">enter</span>
                <span className="mobile-icon">→</span>
              </button>
            </form>
          </div>
        )}

        {/* Final Message Stage */}
        {stage === 'message' && (
          <div className="message-screen">
            <div className="message-text">
              do you want me to message you back?
            </div>
            <div className="message-details">
              <div>name: {name}</div>
              <div>contact: {contact}</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  const settings = await getSiteSettings()

  return {
    props: {
      settings,
    },
    revalidate: 3600, // Revalidate every hour
  }
}
