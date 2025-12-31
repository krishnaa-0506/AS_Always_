import { type Music } from './music-tamil'
import { ROYALTY_FREE_MUSIC } from './music-royalty-free'

export type { Music }

export const MUSIC_LIBRARY: Music[] = [...ROYALTY_FREE_MUSIC]
