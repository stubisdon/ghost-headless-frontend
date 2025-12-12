import { useState, useEffect, useRef } from 'react'
import './index.css'
import type { Experience, TimelineEvent, TextEvent, InputEvent, ChoiceEvent, Ending } from './types/experience'

type Stage = 'play' | 'experience' | 'ending'

// Load experience data
const EXPERIENCE_DATA: Experience = {
  metadata: {
    title: "Interactive Experience",
    duration: 60,
    audioFile: "/audio/knock-knock.mp3"
  },
  timeline: [
    {
      type: "text",
      time: 2,
      text: "welcome"
    },
    {
      type: "text",
      time: 4,
      text: "my name is Catsky"
    },
    {
      type: "text",
      time: 6,
      text: "i created this experience for you"
    },
    {
      type: "input",
      time: 10,
      label: "by the way, what is your name?",
      placeholder: "",
      required: true,
      storeAs: "name",
      timeout: 30
    },
    {
      type: "text",
      time: 35,
      text: "here's a voicemail i once got from a workshop"
    },
    {
      type: "text",
      time: 41,
      text: "[the subtitles to the phone call]"
    }
  ],
  endings: [
    {
      id: "ending-complete",
      title: "Thank You",
      text: "Thank you for experiencing this journey."
    }
  ]
}

export default function App() {
  const [stage, setStage] = useState<Stage>('play')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<TimelineEvent | null>(null)
  const [userData, setUserData] = useState<Record<string, string>>({})
  const [currentEnding, setCurrentEnding] = useState<Ending | null>(null)
  const [showInputResponse, setShowInputResponse] = useState<string | null>(null)
  const [hoveredMarker, setHoveredMarker] = useState<{ time: number; label: string } | null>(null)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeUpdateIntervalRef = useRef<number | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineTrackRef = useRef<HTMLDivElement>(null)

  // Get text events for timeline markers
  const textEvents = EXPERIENCE_DATA.timeline.filter((e): e is TextEvent => e.type === 'text')
  const inputEvents = EXPERIENCE_DATA.timeline.filter((e): e is InputEvent => e.type === 'input')
  const choiceEvents = EXPERIENCE_DATA.timeline.filter((e): e is ChoiceEvent => e.type === 'choice')
  const allMarkers = [...textEvents, ...inputEvents, ...choiceEvents]

  // Handle timeline seek
  const handleTimelineSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration || !timelineTrackRef.current) return
    
    const rect = timelineTrackRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = percentage * duration
    
    audioRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
    updateCurrentEvent(seekTime)
  }

  // Update current event based on time
  const updateCurrentEvent = (time: number) => {
    // Find the most recent event that should be active
    const activeEvent = EXPERIENCE_DATA.timeline
      .filter(e => time >= e.time)
      .pop() || null
    
    setCurrentEvent(activeEvent)
  }

  // Handle play button click
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.src = EXPERIENCE_DATA.metadata.audioFile || '/audio/knock-knock.mp3'
      audioRef.current.play()
      setStage('experience')
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
    setCurrentEvent(null)
    setCurrentTime(0)
    setUserData({})
    setCurrentEnding(null)
    setShowInputResponse(null)
    setIsPaused(false)
  }

  // Handle input submission
  const handleInputSubmit = (e: React.FormEvent, event: InputEvent) => {
    e.preventDefault()
    const input = e.currentTarget.querySelector('input') as HTMLInputElement
    if (input && input.value.trim()) {
      const userName = input.value.trim()
      setUserData(prev => ({ ...prev, [event.storeAs]: userName }))
      input.value = ''
      
      // Show response if this is the name input
      if (event.storeAs === 'name') {
        setShowInputResponse(`nice to meet you, ${userName}`)
        // Hide the input form
        setCurrentEvent(null)
        // Continue with timeline after 3 seconds
        setTimeout(() => {
          setShowInputResponse(null)
          // Resume timeline tracking
          if (audioRef.current) {
            updateCurrentEvent(audioRef.current.currentTime)
          }
        }, 3000)
      }
    }
  }

  // Handle choice selection
  const handleChoiceSelect = (option: ChoiceEvent['options'][0]) => {
    setUserData(prev => ({ ...prev, digDeeper: option.value }))
    
    // Find and show the ending
    const ending = EXPERIENCE_DATA.endings.find(e => e.id === option.leadsTo)
    if (ending) {
      // Check if conditions match
      const conditionsMatch = !ending.conditions || Object.entries(ending.conditions).every(
        ([key, value]) => userData[key] === value || (key === 'digDeeper' && option.value === value)
      )
      
      if (conditionsMatch) {
        setCurrentEnding(ending)
        setStage('ending')
        if (audioRef.current) {
          audioRef.current.pause()
        }
        if (timeUpdateIntervalRef.current) {
          clearInterval(timeUpdateIntervalRef.current)
        }
      }
    }
  }

  // Track audio timecode and update events
  const startTimecodeTracking = () => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
    }

    timeUpdateIntervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime
        const duration = audioRef.current.duration
        
        setCurrentTime(currentTime)
        if (duration && !isNaN(duration)) {
          setDuration(duration)
        }

        updateCurrentEvent(currentTime)

        // Auto-focus input when input event becomes active
        if (currentEvent?.type === 'input' && inputRef.current) {
          setTimeout(() => inputRef.current?.focus(), 100)
        }
      }
    }, 100)
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
      }
    }
  }, [])

  // Get marker label for tooltip
  const getMarkerLabel = (event: TimelineEvent): string => {
    if (event.type === 'text') return event.text
    if (event.type === 'input') return event.label
    if (event.type === 'choice') return event.question
    return ''
  }

  return (
    <div className="app-container">
      {/* Hidden audio player */}
      <audio
        ref={audioRef}
        src={EXPERIENCE_DATA.metadata.audioFile || '/audio/knock-knock.mp3'}
        preload="auto"
      />

      {/* Play Button Stage */}
      {stage === 'play' && (
        <button className="play-button" onClick={handlePlay}>
          play
        </button>
      )}

      {/* Experience Stage */}
      {stage === 'experience' && (
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

          {/* Text Display - always centered at same position */}
          {(currentEvent?.type === 'text' || showInputResponse || (currentEvent?.type === 'input')) && (
            <div className="text-display">
              <div className="conversational-text">
                {showInputResponse || 
                 (currentEvent?.type === 'text' ? currentEvent.text : '') ||
                 (currentEvent?.type === 'input' ? currentEvent.label : '')}
              </div>
            </div>
          )}

          {/* Input Display - positioned below without affecting text */}
          {currentEvent?.type === 'input' && !showInputResponse && (
            <div className="input-container-below">
              <form onSubmit={(e) => handleInputSubmit(e, currentEvent)} className="name-form">
                <input
                  ref={inputRef}
                  id="dynamic-input"
                  type="text"
                  className="form-input"
                  placeholder={currentEvent.placeholder || ''}
                  autoFocus
                  autoComplete="off"
                />
                <button type="submit" className="submit-button">
                  enter
                </button>
              </form>
            </div>
          )}

          {/* Choice Display */}
          {currentEvent?.type === 'choice' && (
            <div className="form-screen">
              <div className="form-label">{currentEvent.question}</div>
              <div className="yes-no-buttons">
                {currentEvent.options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleChoiceSelect(option)}
                    className="yes-no-button"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {duration > 0 && (
            <div className="timeline-container" ref={timelineRef}>
              <div 
                className="timeline-track" 
                ref={timelineTrackRef}
                onClick={handleTimelineSeek}
              >
                {/* Timeline markers */}
                {allMarkers.map((event) => (
                  <div
                    key={`${event.type}-${event.time}`}
                    className="timeline-marker"
                    style={{
                      left: `${(event.time / duration) * 100}%`
                    }}
                    onMouseEnter={() => {
                      setHoveredMarker({
                        time: event.time,
                        label: getMarkerLabel(event)
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
                    <div className="timeline-tooltip-text">{hoveredMarker.label}</div>
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

      {/* Ending Stage */}
      {stage === 'ending' && currentEnding && (
        <div className="form-screen">
          <div className="text-display">
            <div className="conversational-text">
              <div className="greeting">{currentEnding.title}</div>
              <br />
              {currentEnding.text}
            </div>
          </div>
          <button className="debug-stop-button" onClick={handleStop} style={{ position: 'fixed', bottom: '1rem', left: '1rem' }}>
            restart
          </button>
        </div>
      )}
    </div>
  )
}
