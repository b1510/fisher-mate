import type { LureType, WaterClarity } from './types.js'

export const AI_CONFIDENCE_THRESHOLD = 0.6

export const LURE_TYPE_OPTIONS: { value: LureType; label: string }[] = [
  { value: 'SPINNERBAIT', label: 'Spinnerbait' },
  { value: 'JIG', label: 'Jig' },
  { value: 'CRANKBAIT', label: 'Crankbait' },
  { value: 'SOFT_PLASTIC', label: 'Leurre souple' },
  { value: 'SPOON', label: 'Cuillère' },
  { value: 'TOPWATER', label: 'Popper / surface' },
  { value: 'JERKBAIT', label: 'Jerkbait' },
  { value: 'BUZZBAIT', label: 'Buzzbait' },
  { value: 'CHATTERBAIT', label: 'Chatterbait' },
  { value: 'SPINNER', label: 'Cuillère tournante' },
  { value: 'NED_RIG', label: 'Ned rig' },
  { value: 'AUTRE', label: 'Autre' },
]

export const WATER_CLARITY_OPTIONS: { value: WaterClarity; label: string }[] = [
  { value: 'CLAIRE', label: 'Claire' },
  { value: 'TROUBLE', label: 'Trouble' },
  { value: 'BOUEUSE', label: 'Boueuse' },
]
