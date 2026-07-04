import type { LureType } from './types'

const KEYWORDS: [LureType, string[]][] = [
  ['SPINNERBAIT', ['spinnerbait']],
  ['CHATTERBAIT', ['chatterbait', 'chatter bait']],
  ['BUZZBAIT', ['buzzbait', 'buzz bait']],
  ['JIG', ['jig']],
  ['CRANKBAIT', ['crankbait', 'crank']],
  ['JERKBAIT', ['jerkbait', 'jerk']],
  ['SOFT_PLASTIC', ['leurre souple', 'soft plastic', 'shad', 'creature', 'worm', 'ver souple']],
  ['SPOON', ['cuillere ondulante', 'spoon']],
  ['SPINNER', ['cuillere tournante', 'spinner']],
  ['TOPWATER', ['popper', 'stickbait', 'walking bait', 'surface', 'topwater']],
  ['NED_RIG', ['ned rig', 'ned']],
]

const DIACRITICS_REGEX = String.fromCharCode(91, 0x0300, 45, 0x036f, 93)

/** Normalizes a free-text lure description (from AI or user input) to the closest LureType enum member. */
export function normalizeLureType(raw: string | null | undefined): LureType {
  if (!raw) return 'AUTRE'
  const stripDiacritics = new RegExp(DIACRITICS_REGEX, 'g')
  const value = raw.toLowerCase().normalize('NFD').replace(stripDiacritics, '')

  for (const [type, keywords] of KEYWORDS) {
    if (keywords.some((keyword) => value.includes(keyword))) return type
  }
  return 'AUTRE'
}
