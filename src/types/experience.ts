// Experience format types
export interface ExperienceMetadata {
  title: string
  duration?: number
  audioFile?: string
}

export interface TextEvent {
  type: 'text'
  time: number
  text: string
  duration?: number
}

export interface InputEvent {
  type: 'input'
  time: number
  label: string
  placeholder?: string
  required?: boolean
  timeout?: number
  storeAs: string
}

export interface ChoiceOption {
  text: string
  value: string
  leadsTo: string
}

export interface ChoiceEvent {
  type: 'choice'
  time: number
  question: string
  options: ChoiceOption[]
  timeout?: number
}

export type TimelineEvent = TextEvent | InputEvent | ChoiceEvent

export interface Ending {
  id: string
  title: string
  text: string
  conditions?: Record<string, string>
}

export interface Experience {
  metadata: ExperienceMetadata
  timeline: TimelineEvent[]
  endings: Ending[]
}

