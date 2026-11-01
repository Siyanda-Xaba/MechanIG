export type RepairDifficulty =
  | 'Easy'
  | 'Moderate'
  | 'Advanced'

export type RepairStep = {
  id: string
  order: number
  title: string
  description: string
}

export type TutorialVideo = {
  videoId: string
  title: string
  channelName: string
  thumbnailUrl: string
}

export type RepairGuide = {
  id: string
  diagnosticResultId: string

  title: string
  description: string

  difficulty: RepairDifficulty
  estimatedMinutes: number

  diyEligible: boolean

  safetyWarnings: string[]

  toolsRequired: string[]
  partsRequired: string[]

  steps: RepairStep[]

  videos: TutorialVideo[]
}