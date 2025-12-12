import { useState, useEffect, useRef } from 'react'
import './index.css'

type Stage = 'play' | 'intro' | 'name' | 'conversation' | 'aha' | 'contact' | 'complete'

interface TextCue {
  time: number // in seconds
  text: string
}

// Text cues synced to audio timecode
const TEXT_CUES: TextCue[] = [
  { time: 2, text: 'welcome' },
  { time: 6, text: 'let\'s begin' },
  { time: 10, text: 'this is an interactive experience' },
  { time: 15, text: 'we\'re about to get to know each other' },
  { time: 20, text: 'are you ready?' },
]

export default function App() {
  const [stage, setStage] = useState<Stage>('play')
  const [currentText, setCurrentText] = useState<string>('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [conversationStep, setConversationStep] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredMarker, setHoveredMarker] = useState<{ time: number; text: string } | null>(null)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const contactInputRef = useRef<HTMLInputElement>(null)
  const timeUpdateIntervalRef = useRef<number | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineTrackRef = useRef<HTMLDivElement>(null)

  // Handle timeline seek
  const handleTimelineSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration || !timelineTrackRef.current) return
    
    const rect = timelineTrackRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = percentage * duration
    
    audioRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
    
    // Update current text based on seek time
    const latestCue = TEXT_CUES.filter(cue => seekTime >= cue.time).pop()
    setCurrentText(latestCue ? latestCue.text : '')
  }

  // Handle play button click
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setStage('intro')
      startTimecodeTracking()
    }
  }

  // Handle pause button click
  const handlePause = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play()
        startTimecodeTracking()
        setIsPaused(false)
      } else {
        audioRef.current.pause()
        if (timeUpdateIntervalRef.current) {
          clearInterval(timeUpdateIntervalRef.current)
        }
        setIsPaused(true)
      }
    }
  }

  // Handle stop button click
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
    }
    setStage('play')
    setCurrentText('')
    setCurrentTime(0)
    setIsPaused(false)
  }

  // Track audio timecode and show text cues
  const startTimecodeTracking = () => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
    }

    timeUpdateIntervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime
        const duration = audioRef.current.duration
        
        // Update time counter
        setCurrentTime(currentTime)
        if (duration && !isNaN(duration)) {
          setDuration(duration)
        }

        // Show text cues based on timecode - show only the latest/current text
        const latestCue = TEXT_CUES.filter((cue) => currentTime >= cue.time).pop()
        if (latestCue && latestCue.text !== currentText) {
          setCurrentText(latestCue.text)
        }

        // Transition to name input near the end or after all cues
        if (
          currentTime >= duration - 3 ||
          (currentTime >= TEXT_CUES[TEXT_CUES.length - 1].time + 3)
        ) {
          if (timeUpdateIntervalRef.current) {
            clearInterval(timeUpdateIntervalRef.current)
          }
          setTimeout(() => {
            setStage('name')
            setTimeout(() => {
              nameInputRef.current?.focus()
            }, 300)
          }, 1000)
        }
      }
    }, 100)
  }

  // Handle name submission
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setStage('conversation')
      setConversationStep(0)
      // Start conversational flow
      setTimeout(() => {
        setShowTyping(true)
        setTimeout(() => {
          setShowTyping(false)
          setConversationStep(1)
        }, 1500)
      }, 500)
    }
  }

  // Handle conversational responses
  useEffect(() => {
    if (stage === 'conversation') {
      if (conversationStep === 1) {
        // After confirming name, show more conversation
        setTimeout(() => {
          setShowTyping(true)
          setTimeout(() => {
            setShowTyping(false)
            setConversationStep(2)
          }, 1500)
        }, 2000)
      } else if (conversationStep === 2) {
        // After second response, show A-HA moment
        setTimeout(() => {
          setStage('aha')
        }, 3000)
      }
    }
  }, [stage, conversationStep])

  // Handle A-HA moment completion
  useEffect(() => {
    if (stage === 'aha') {
      // After A-HA moment, transition to contact
      setTimeout(() => {
        setStage('contact')
        setTimeout(() => {
          contactInputRef.current?.focus()
        }, 300)
      }, 4000)
    }
  }, [stage])

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
      
      setStage('complete')
    }
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="app-container">
      {/* Hidden audio player */}
      <audio
        ref={audioRef}
        src="/audio/knock-knock.mp3"
        preload="auto"
      />

      {/* Play Button Stage */}
      {stage === 'play' && (
        <button className="play-button" onClick={handlePlay}>
          play
        </button>
      )}

      {/* Intro Stage - Text appears synced to timecode */}
      {stage === 'intro' && (
        <div className="form-screen">
          <div className="debug-buttons">
            <button className="debug-pause-button" onClick={handlePause} title={isPaused ? "Resume" : "Pause"}>
              {isPaused ? 'resume' : 'pause'}
            </button>
            <button className="debug-stop-button" onClick={handleStop} title="Stop">
              stop
            </button>
          </div>
          <div className="time-counter">
            {Math.floor(currentTime)}s / {duration ? Math.floor(duration) : '?'}s
          </div>
          <div className="text-display">
            {currentText && (
              <div className="conversational-text">
                {currentText}
              </div>
            )}
          </div>
          
          {/* Timeline */}
          {duration > 0 && (
            <div className="timeline-container" ref={timelineRef}>
              <div 
                className="timeline-track" 
                ref={timelineTrackRef}
                onClick={handleTimelineSeek}
              >
                {/* Timeline markers for text cues */}
                {TEXT_CUES.map((cue) => (
                  <div
                    key={cue.time}
                    className="timeline-marker"
                    style={{
                      left: `${(cue.time / duration) * 100}%`
                    }}
                    onMouseEnter={() => {
                      setHoveredMarker({
                        time: cue.time,
                        text: cue.text
                      })
                    }}
                    onMouseLeave={() => setHoveredMarker(null)}
                  />
                ))}
                
                {/* Tooltip for hovered marker */}
                {hoveredMarker && (
                  <div
                    className="timeline-marker-tooltip"
                    style={{
                      left: `${(hoveredMarker.time / duration) * 100}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <div className="timeline-tooltip-time">{hoveredMarker.time}s</div>
                    <div className="timeline-tooltip-text">{hoveredMarker.text}</div>
                  </div>
                )}
                
                {/* Playhead indicator */}
                <div
                  className="timeline-playhead"
                  style={{
                    left: `${(currentTime / duration) * 100}%`
                  }}
                />
                
                {/* Timeline progress bar */}
                <div
                  className="timeline-progress"
                  style={{
                    width: `${(currentTime / duration) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Name Input Stage */}
      {stage === 'name' && (
        <div className="form-screen">
          <form onSubmit={handleNameSubmit} className="name-form">
            <label htmlFor="name" className="form-label">
              what's your first name?
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
              enter
            </button>
          </form>
        </div>
      )}

      {/* Conversational Stage */}
      {stage === 'conversation' && (
        <div className="form-screen">
          <div className="conversational-text">
            {conversationStep === 0 && (
              <>
                nice to meet you, {name}
                {showTyping && <span className="typing-indicator">...</span>}
              </>
            )}
            {conversationStep === 1 && (
              <>
                i've got your name: {name}
                {showTyping && <span className="typing-indicator">...</span>}
              </>
            )}
            {conversationStep === 2 && (
              <>
                we're getting to know each other now
                <br />
                <br />
                and you can interact with me
              </>
            )}
          </div>
        </div>
      )}

      {/* A-HA Moment Stage */}
      {stage === 'aha' && (
        <div className="form-screen">
          <div className="text-display">
            <div className="conversational-text">
              {name}, you just interacted with me
              <br />
              <br />
              and i responded
              <br />
              <br />
              this is the magic of interactive experiences
            </div>
          </div>
        </div>
      )}

      {/* Contact Input Stage */}
      {stage === 'contact' && (
        <div className="form-screen">
          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="greeting">thanks for the journey, {name}</div>
            <label htmlFor="contact" className="form-label">
              would you like more experiences like this?
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
              enter
            </button>
          </form>
        </div>
      )}

      {/* Complete Stage */}
      {stage === 'complete' && (
        <div className="form-screen">
          <div className="text-display">
            <div className="conversational-text">
              thank you, {name}
              <br />
              <br />
              we'll be in touch
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

