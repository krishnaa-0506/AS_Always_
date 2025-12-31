import { Music } from './music-tamil'

type CuratedTrack = {
  id: string
  title: string
  genre: string
  emotion: string[]
  duration: string
  relationship: 'friend' | 'lover' | 'spouse' | 'parents' | 'siblings'
  url: string
}

const CURATED_50_TRACKS: CuratedTrack[] = [
  { id: 'friends-happy-walk', title: 'Happy Walk', genre: 'Acoustic', emotion: ['joy', 'friendship'], duration: '2:45', relationship: 'friend', url: '/songs/friends/happy-walk.mp3' },
  { id: 'friends-old-memories', title: 'Old Memories', genre: 'Piano', emotion: ['nostalgia', 'warm'], duration: '3:20', relationship: 'friend', url: '/songs/friends/old-memories.mp3' },
  { id: 'friends-college-days', title: 'College Days', genre: 'Lo-fi', emotion: ['fun', 'youth'], duration: '2:55', relationship: 'friend', url: '/songs/friends/college-days.mp3' },
  { id: 'friends-laugh-together', title: 'Laugh Together', genre: 'Folk', emotion: ['joy', 'bond'], duration: '2:35', relationship: 'friend', url: '/songs/friends/laugh-together.mp3' },
  { id: 'friends-sunset-talks', title: 'Sunset Talks', genre: 'Acoustic', emotion: ['calm', 'comfort'], duration: '3:10', relationship: 'friend', url: '/songs/friends/sunset-talks.mp3' },
  { id: 'friends-night-ride', title: 'Night Ride', genre: 'Ambient', emotion: ['cool', 'calm'], duration: '3:05', relationship: 'friend', url: '/songs/friends/night-ride.mp3' },
  { id: 'friends-forever-squad', title: 'Forever Squad', genre: 'Ambient', emotion: ['bond', 'loyalty'], duration: '3:30', relationship: 'friend', url: '/songs/friends/forever-squad.mp3' },
  { id: 'friends-good-old-times', title: 'Good Old Times', genre: 'Piano', emotion: ['nostalgia', 'warm'], duration: '3:15', relationship: 'friend', url: '/songs/friends/good-old-times.mp3' },
  { id: 'friends-city-lights', title: 'City Lights', genre: 'Lo-fi', emotion: ['youth', 'fun'], duration: '2:50', relationship: 'friend', url: '/songs/friends/city-lights.mp3' },
  { id: 'friends-victory-smile', title: 'Victory Smile', genre: 'Cinematic', emotion: ['pride', 'joy'], duration: '3:25', relationship: 'friend', url: '/songs/friends/victory-smile.mp3' },

  { id: 'lover-soft-heart', title: 'Soft Heart', genre: 'Piano', emotion: ['love', 'tender'], duration: '3:10', relationship: 'lover', url: '/songs/lover/soft-heart.mp3' },
  { id: 'lover-midnight-promise', title: 'Midnight Promise', genre: 'Ambient', emotion: ['romance', 'longing'], duration: '3:35', relationship: 'lover', url: '/songs/lover/midnight-promise.mp3' },
  { id: 'lover-falling-slowly', title: 'Falling Slowly', genre: 'Acoustic', emotion: ['intimate', 'love'], duration: '3:05', relationship: 'lover', url: '/songs/lover/falling-slowly.mp3' },
  { id: 'lover-dream-with-you', title: 'Dream With You', genre: 'Piano', emotion: ['emotional', 'love'], duration: '3:40', relationship: 'lover', url: '/songs/lover/dream-with-you.mp3' },
  { id: 'lover-warm-touch', title: 'Warm Touch', genre: 'World', emotion: ['love', 'soft'], duration: '3:20', relationship: 'lover', url: '/songs/lover/warm-touch.mp3' },
  { id: 'lover-moonlight-talk', title: 'Moonlight Talk', genre: 'Ambient', emotion: ['longing', 'romance'], duration: '3:30', relationship: 'lover', url: '/songs/lover/moonlight-talk.mp3' },
  { id: 'lover-gentle-rain', title: 'Gentle Rain', genre: 'Lo-fi', emotion: ['romance', 'calm'], duration: '2:55', relationship: 'lover', url: '/songs/lover/gentle-rain.mp3' },
  { id: 'lover-silent-smile', title: 'Silent Smile', genre: 'Piano', emotion: ['tender', 'love'], duration: '3:00', relationship: 'lover', url: '/songs/lover/silent-smile.mp3' },
  { id: 'lover-breath-between-us', title: 'Breath Between Us', genre: 'Classical', emotion: ['deep', 'love'], duration: '3:45', relationship: 'lover', url: '/songs/lover/breath-between-us.mp3' },
  { id: 'lover-always-you', title: 'Always You', genre: 'Acoustic', emotion: ['commitment', 'love'], duration: '3:15', relationship: 'lover', url: '/songs/lover/always-you.mp3' },

  { id: 'spouse-home-together', title: 'Home Together', genre: 'Piano', emotion: ['comfort', 'home'], duration: '3:20', relationship: 'spouse', url: '/songs/spouse/home-together.mp3' },
  { id: 'spouse-forever-calm', title: 'Forever Calm', genre: 'Ambient', emotion: ['trust', 'peace'], duration: '3:35', relationship: 'spouse', url: '/songs/spouse/forever-calm.mp3' },
  { id: 'spouse-shared-silence', title: 'Shared Silence', genre: 'Classical', emotion: ['peace', 'togetherness'], duration: '3:40', relationship: 'spouse', url: '/songs/spouse/shared-silence.mp3' },
  { id: 'spouse-morning-tea', title: 'Morning Tea', genre: 'Acoustic', emotion: ['warmth', 'comfort'], duration: '2:50', relationship: 'spouse', url: '/songs/spouse/morning-tea.mp3' },
  { id: 'spouse-through-time', title: 'Through Time', genre: 'Piano', emotion: ['bond', 'memories'], duration: '3:30', relationship: 'spouse', url: '/songs/spouse/through-time.mp3' },
  { id: 'spouse-safe-place', title: 'Safe Place', genre: 'Ambient', emotion: ['security', 'comfort'], duration: '3:25', relationship: 'spouse', url: '/songs/spouse/safe-place.mp3' },
  { id: 'spouse-quiet-love', title: 'Quiet Love', genre: 'World', emotion: ['stability', 'love'], duration: '3:15', relationship: 'spouse', url: '/songs/spouse/quiet-love.mp3' },
  { id: 'spouse-holding-hands', title: 'Holding Hands', genre: 'Piano', emotion: ['togetherness', 'love'], duration: '3:05', relationship: 'spouse', url: '/songs/spouse/holding-hands.mp3' },
  { id: 'spouse-old-us', title: 'Old Us', genre: 'Acoustic', emotion: ['memories', 'warm'], duration: '3:10', relationship: 'spouse', url: '/songs/spouse/old-us.mp3' },
  { id: 'spouse-still-with-you', title: 'Still With You', genre: 'Piano', emotion: ['eternal', 'love'], duration: '3:35', relationship: 'spouse', url: '/songs/spouse/still-with-you.mp3' },

  { id: 'parents-mothers-lullaby', title: "Mother's Lullaby", genre: 'Piano', emotion: ['care', 'love'], duration: '3:10', relationship: 'parents', url: '/songs/parents/mothers-lullaby.mp3' },
  { id: 'parents-fathers-strength', title: "Father's Strength", genre: 'Classical', emotion: ['protection', 'pride'], duration: '3:25', relationship: 'parents', url: '/songs/parents/fathers-strength.mp3' },
  { id: 'parents-childhood-home', title: 'Childhood Home', genre: 'Ambient', emotion: ['comfort', 'nostalgia'], duration: '3:40', relationship: 'parents', url: '/songs/parents/childhood-home.mp3' },
  { id: 'parents-ammas-smile', title: "Amma's Smile", genre: 'World', emotion: ['love', 'care'], duration: '3:15', relationship: 'parents', url: '/songs/parents/ammas-smile.mp3' },
  { id: 'parents-appas-walk', title: "Appa's Walk", genre: 'Acoustic', emotion: ['pride', 'warm'], duration: '2:55', relationship: 'parents', url: '/songs/parents/appas-walk.mp3' },
  { id: 'parents-safe-arms', title: 'Safe Arms', genre: 'Piano', emotion: ['security', 'care'], duration: '3:20', relationship: 'parents', url: '/songs/parents/safe-arms.mp3' },
  { id: 'parents-evening-prayer', title: 'Evening Prayer', genre: 'Ambient', emotion: ['peace', 'comfort'], duration: '3:30', relationship: 'parents', url: '/songs/parents/evening-prayer.mp3' },
  { id: 'parents-roots', title: 'Roots', genre: 'Folk', emotion: ['belonging', 'warm'], duration: '3:05', relationship: 'parents', url: '/songs/parents/roots.mp3' },
  { id: 'parents-silent-sacrifice', title: 'Silent Sacrifice', genre: 'Classical', emotion: ['gratitude', 'love'], duration: '3:45', relationship: 'parents', url: '/songs/parents/silent-sacrifice.mp3' },
  { id: 'parents-always-there', title: 'Always There', genre: 'Piano', emotion: ['assurance', 'love'], duration: '3:25', relationship: 'parents', url: '/songs/parents/always-there.mp3' },

  { id: 'siblings-mischief-days', title: 'Mischief Days', genre: 'Folk', emotion: ['fun', 'playful'], duration: '2:35', relationship: 'siblings', url: '/songs/siblings/mischief-days.mp3' },
  { id: 'siblings-shared-secrets', title: 'Shared Secrets', genre: 'Lo-fi', emotion: ['bond', 'trust'], duration: '2:55', relationship: 'siblings', url: '/songs/siblings/shared-secrets.mp3' },
  { id: 'siblings-childhood-fight', title: 'Childhood Fight', genre: 'Piano', emotion: ['joy', 'fun'], duration: '2:40', relationship: 'siblings', url: '/songs/siblings/childhood-fight.mp3' },
  { id: 'siblings-same-blood', title: 'Same Blood', genre: 'Classical', emotion: ['unity', 'bond'], duration: '3:20', relationship: 'siblings', url: '/songs/siblings/same-blood.mp3' },
  { id: 'siblings-late-night-talks', title: 'Late Night Talks', genre: 'Ambient', emotion: ['trust', 'comfort'], duration: '3:15', relationship: 'siblings', url: '/songs/siblings/late-night-talks.mp3' },
  { id: 'siblings-growing-together', title: 'Growing Together', genre: 'Acoustic', emotion: ['growth', 'warm'], duration: '3:05', relationship: 'siblings', url: '/songs/siblings/growing-together.mp3' },
  { id: 'siblings-silent-support', title: 'Silent Support', genre: 'Piano', emotion: ['care', 'comfort'], duration: '3:10', relationship: 'siblings', url: '/songs/siblings/silent-support.mp3' },
  { id: 'siblings-old-photos', title: 'Old Photos', genre: 'Piano', emotion: ['nostalgia', 'warm'], duration: '3:30', relationship: 'siblings', url: '/songs/siblings/old-photos.mp3' },
  { id: 'siblings-family-joke', title: 'Family Joke', genre: 'Acoustic', emotion: ['fun', 'joy'], duration: '2:45', relationship: 'siblings', url: '/songs/siblings/family-joke.mp3' },
  { id: 'siblings-no-matter-what', title: 'No Matter What', genre: 'Ambient', emotion: ['loyalty', 'bond'], duration: '3:35', relationship: 'siblings', url: '/songs/siblings/no-matter-what.mp3' }
]

export const ROYALTY_FREE_MUSIC: Music[] = CURATED_50_TRACKS.map((t) => ({
  id: t.id,
  title: t.title,
  artist: 'Instrumental',
  genre: t.genre,
  emotion: t.emotion,
  duration: t.duration,
  appropriateFor: [t.relationship],
  url: t.url,
  language: 'Instrumental'
}))
