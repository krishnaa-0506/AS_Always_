export interface LocalSong {
  id: string
  title: string
  artist: string
  url: string
  duration: string
  genre: string
  emotion: string[]
  appropriateFor: string[]
  category: string
}

export const LOCAL_SONGS: LocalSong[] = [
  // Friends Category (23 songs)
  {
    id: 'friends-001',
    title: 'Silent Promise',
    artist: 'Luma Trails',
    url: '/songs/friends/001-friends.mp3',
    duration: '3:45',
    genre: 'Pop',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-002',
    title: 'After the Rain',
    artist: 'SoftFrame',
    url: '/songs/friends/002-friends.mp3',
    duration: '4:12',
    genre: 'Acoustic',
    emotion: ['friendship', 'nostalgia'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-003',
    title: 'Fading Letters',
    artist: 'Echo Harbor',
    url: '/songs/friends/003-friends.mp3',
    duration: '3:28',
    genre: 'Folk',
    emotion: ['friendship', 'peace'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-004',
    title: 'Moonlight Drift',
    artist: 'Stillwave',
    url: '/songs/friends/004-friends.mp3',
    duration: '2:58',
    genre: 'Rock',
    emotion: ['friendship', 'hope'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-005',
    title: 'Gentle Goodbye',
    artist: 'Pale Horizon',
    url: '/songs/friends/005-friends.mp3',
    duration: '3:35',
    genre: 'Rock',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-006',
    title: 'Echoes of Home',
    artist: 'Quiet Field',
    url: '/songs/friends/006-friends.mp3',
    duration: '4:17',
    genre: 'Soul',
    emotion: ['friendship', 'peace'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-007',
    title: 'Last Train Memory',
    artist: 'Drift Notes',
    url: '/songs/friends/007-friends.mp3',
    duration: '3:52',
    genre: 'R&B',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-008',
    title: 'Warm Window Lights',
    artist: 'Calm Atlas',
    url: '/songs/friends/008-friends.mp3',
    duration: '4:15',
    genre: 'Pop',
    emotion: ['friendship', 'love'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-009',
    title: 'Stillness Between Us',
    artist: 'Gentle Axis',
    url: '/songs/friends/009-friends.mp3',
    duration: '3:38',
    genre: 'Rock',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-010',
    title: 'Unspoken Feelings',
    artist: 'Slow Ember',
    url: '/songs/friends/010-friends.mp3',
    duration: '4:02',
    genre: 'Contemporary',
    emotion: ['friendship', 'nostalgia'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-011',
    title: 'Soft Horizons',
    artist: 'Noonlight Studio',
    url: '/songs/friends/011-friends.mp3',
    duration: '2:47',
    genre: 'Folk',
    emotion: ['friendship', 'nostalgia'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-012',
    title: 'Midnight Thoughts',
    artist: 'Silent Coast',
    url: '/songs/friends/012-friends.mp3',
    duration: '3:45',
    genre: 'Pop',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-013',
    title: 'Floating Petals',
    artist: 'Warm Canvas',
    url: '/songs/friends/013-friends.mp3',
    duration: '3:28',
    genre: 'Pop',
    emotion: ['friendship', 'gratitude'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-014',
    title: 'Calm Before Dawn',
    artist: 'Floating Tone',
    url: '/songs/friends/014-friends.mp3',
    duration: '4:12',
    genre: 'Country',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-015',
    title: 'Empty Benches',
    artist: 'Low Tide Audio',
    url: '/songs/friends/015-friends.mp3',
    duration: '2:55',
    genre: 'Children',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-016',
    title: 'Time Slows Down',
    artist: 'Whisper Lane',
    url: '/songs/friends/016-friends.mp3',
    duration: '3:18',
    genre: 'Classical',
    emotion: ['friendship', 'peace'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-017',
    title: 'Whispered Hopes',
    artist: 'Open Air Ensemble',
    url: '/songs/friends/017-friends.mp3',
    duration: '3:33',
    genre: 'Pop',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-018',
    title: 'Long Walk Back',
    artist: 'Faint Signal',
    url: '/songs/friends/018-friends.mp3',
    duration: '4:02',
    genre: 'Pop',
    emotion: ['friendship', 'nostalgia'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-019',
    title: 'Fragile Moments',
    artist: 'Pastel Soundworks',
    url: '/songs/friends/019-friends.mp3',
    duration: '2:52',
    genre: 'Rock',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-020',
    title: 'Golden Silence',
    artist: 'Calm Current',
    url: '/songs/friends/020-friends.mp3',
    duration: '3:45',
    genre: 'Soul',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-021',
    title: 'Falling Sky',
    artist: 'Soft Loom',
    url: '/songs/friends/021-friends.mp3',
    duration: '4:18',
    genre: 'New Age',
    emotion: ['friendship', 'nostalgia'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-022',
    title: 'Blue Hour',
    artist: 'Subtle Motion Lab',
    url: '/songs/friends/022-friends.mp3',
    duration: '4:28',
    genre: 'Country',
    emotion: ['friendship', 'joy'],
    appropriateFor: ['friend'],
    category: 'friends'
  },
  {
    id: 'friends-023',
    title: 'Quiet Heartbeats',
    artist: 'Golden Static',
    url: '/songs/friends/023-friends.mp3',
    duration: '3:52',
    genre: 'Contemporary',
    emotion: ['friendship', 'peace'],
    appropriateFor: ['friend'],
    category: 'friends'
  },

  // Lover Category (22 songs)
  {
    id: 'lover-024',
    title: 'When Words Fade',
    artist: 'Ambient Room',
    url: '/songs/lover/024-lover.mp3',
    duration: '4:15',
    genre: 'Romantic',
    emotion: ['love', 'romance'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-025',
    title: 'Slow Breathing',
    artist: 'Quiet Theory',
    url: '/songs/lover/025-lover.mp3',
    duration: '3:52',
    genre: 'Pop',
    emotion: ['love', 'joy'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-026',
    title: 'Familiar Streets',
    artist: 'Slow Pattern',
    url: '/songs/lover/026-lover.mp3',
    duration: '4:28',
    genre: 'Acoustic',
    emotion: ['love', 'peace'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-027',
    title: 'Gentle Waves',
    artist: 'Lightfall Collective',
    url: '/songs/lover/027-lover.mp3',
    duration: '3:38',
    genre: 'Romantic',
    emotion: ['love', 'hope'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-028',
    title: 'Waiting Season',
    artist: 'Hollow Frame',
    url: '/songs/lover/028-lover.mp3',
    duration: '4:05',
    genre: 'Pop',
    emotion: ['love', 'celebration'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-029',
    title: 'Soft Footsteps',
    artist: 'Serene Echo',
    url: '/songs/lover/029-lover.mp3',
    duration: '3:48',
    genre: 'Acoustic',
    emotion: ['love', 'nostalgia'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-030',
    title: 'Shared Umbrella',
    artist: 'Still Drift',
    url: '/songs/lover/030-lover.mp3',
    duration: '4:18',
    genre: 'Romantic',
    emotion: ['love', 'peace'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-031',
    title: 'Peaceful Corners',
    artist: 'Noon Glow',
    url: '/songs/lover/031-lover.mp3',
    duration: '3:55',
    genre: 'Pop',
    emotion: ['love', 'joy'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-032',
    title: 'Hidden Smiles',
    artist: 'Blue Distance',
    url: '/songs/lover/032-lover.mp3',
    duration: '4:12',
    genre: 'Acoustic',
    emotion: ['love', 'hope'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-033',
    title: 'Distant Lullaby',
    artist: 'Gentle Loop',
    url: '/songs/lover/033-lover.mp3',
    duration: '3:42',
    genre: 'Romantic',
    emotion: ['love', 'celebration'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-034',
    title: 'Tender Reflections',
    artist: 'Open Window Audio',
    url: '/songs/lover/034-lover.mp3',
    duration: '4:25',
    genre: 'Pop',
    emotion: ['love', 'nostalgia'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-035',
    title: 'Low Light Dreams',
    artist: 'Calm Measure',
    url: '/songs/lover/035-lover.mp3',
    duration: '3:38',
    genre: 'Acoustic',
    emotion: ['love', 'peace'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-036',
    title: 'Warm Memories',
    artist: 'Silent Path',
    url: '/songs/lover/036-lover.mp3',
    duration: '4:08',
    genre: 'Romantic',
    emotion: ['love', 'joy'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-037',
    title: 'Soft Gravity',
    artist: 'Drift Ensemble',
    url: '/songs/lover/037-lover.mp3',
    duration: '3:52',
    genre: 'Pop',
    emotion: ['love', 'hope'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-038',
    title: 'Half-Open Letters',
    artist: 'Warm Signal',
    url: '/songs/lover/038-lover.mp3',
    duration: '4:15',
    genre: 'Acoustic',
    emotion: ['love', 'celebration'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-039',
    title: 'Between Two Hearts',
    artist: 'Fading Tone',
    url: '/songs/lover/039-lover.mp3',
    duration: '3:45',
    genre: 'Romantic',
    emotion: ['love', 'nostalgia'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-040',
    title: 'Evening Calm',
    artist: 'Quiet Bloom',
    url: '/songs/lover/040-lover.mp3',
    duration: '4:22',
    genre: 'Pop',
    emotion: ['love', 'peace'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-041',
    title: 'Quiet Reunion',
    artist: 'Soft Outline',
    url: '/songs/lover/041-lover.mp3',
    duration: '3:58',
    genre: 'Acoustic',
    emotion: ['love', 'joy'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-042',
    title: 'Subtle Joy',
    artist: 'Low Light Studio',
    url: '/songs/lover/042-lover.mp3',
    duration: '4:12',
    genre: 'Romantic',
    emotion: ['love', 'hope'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-043',
    title: 'Window Seat',
    artist: 'Peaceform',
    url: '/songs/lover/043-lover.mp3',
    duration: '3:38',
    genre: 'Pop',
    emotion: ['love', 'celebration'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-044',
    title: 'Pastel Skies',
    artist: 'Motionless Sound',
    url: '/songs/lover/044-lover.mp3',
    duration: '4:05',
    genre: 'Acoustic',
    emotion: ['love', 'nostalgia'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },
  {
    id: 'lover-045',
    title: 'Still Water',
    artist: 'Calm Thread',
    url: '/songs/lover/045-lover.mp3',
    duration: '3:52',
    genre: 'Romantic',
    emotion: ['love', 'peace'],
    appropriateFor: ['lover', 'spouse'],
    category: 'lover'
  },

  // Parents Category (22 songs)
  {
    id: 'parents-068',
    title: 'Breathing Space',
    artist: 'Still Air Audio',
    url: '/songs/parents/068-parents.mp3',
    duration: '4:18',
    genre: 'Folk',
    emotion: ['family', 'gratitude'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-069',
    title: 'Small Miracles',
    artist: 'Open Silence',
    url: '/songs/parents/069-parents.mp3',
    duration: '3:45',
    genre: 'Acoustic',
    emotion: ['family', 'love'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-070',
    title: 'Slow Sunrise',
    artist: 'Gentle Frequency',
    url: '/songs/parents/070-parents.mp3',
    duration: '4:08',
    genre: 'Pop',
    emotion: ['family', 'nostalgia'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-071',
    title: 'Holding Time',
    artist: 'Subtle Horizon',
    url: '/songs/parents/071-parents.mp3',
    duration: '3:52',
    genre: 'Folk',
    emotion: ['family', 'peace'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-072',
    title: 'Faint Echo',
    artist: 'Quiet Room Project',
    url: '/songs/parents/072-parents.mp3',
    duration: '4:25',
    genre: 'Acoustic',
    emotion: ['family', 'gratitude'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-073',
    title: 'Soft Horizons II',
    artist: 'Soft Passage',
    url: '/songs/parents/073-parents.mp3',
    duration: '3:38',
    genre: 'Pop',
    emotion: ['family', 'love'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-074',
    title: 'Gentle Awakening',
    artist: 'Warm Phase',
    url: '/songs/parents/074-parents.mp3',
    duration: '4:12',
    genre: 'Folk',
    emotion: ['family', 'hope'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-075',
    title: 'Silent Roads',
    artist: 'Silent Lines',
    url: '/songs/parents/075-parents.mp3',
    duration: '3:55',
    genre: 'Acoustic',
    emotion: ['family', 'nostalgia'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-076',
    title: 'Memory Lines',
    artist: 'Driftfield',
    url: '/songs/parents/076-parents.mp3',
    duration: '4:18',
    genre: 'Pop',
    emotion: ['family', 'peace'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-077',
    title: 'Calm Arrival',
    artist: 'Calm Spectrum',
    url: '/songs/parents/077-parents.mp3',
    duration: '3:42',
    genre: 'Folk',
    emotion: ['family', 'gratitude'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-078',
    title: 'Late Night Glow',
    artist: 'Ambient Atlas',
    url: '/songs/parents/078-parents.mp3',
    duration: '4:05',
    genre: 'Acoustic',
    emotion: ['family', 'love'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-079',
    title: 'Thoughtful Pause',
    artist: 'Pale Sound',
    url: '/songs/parents/079-parents.mp3',
    duration: '3:48',
    genre: 'Pop',
    emotion: ['family', 'hope'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-080',
    title: 'Floating Lights',
    artist: 'Stillform',
    url: '/songs/parents/080-parents.mp3',
    duration: '4:22',
    genre: 'Folk',
    emotion: ['family', 'nostalgia'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-081',
    title: 'Safe Distance',
    artist: 'Echo Frame',
    url: '/songs/parents/081-parents.mp3',
    duration: '3:35',
    genre: 'Acoustic',
    emotion: ['family', 'peace'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-082',
    title: 'Quiet Comfort',
    artist: 'Gentle Rise',
    url: '/songs/parents/082-parents.mp3',
    duration: '4:08',
    genre: 'Pop',
    emotion: ['family', 'gratitude'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-083',
    title: 'Open Fields',
    artist: 'Quiet Layers',
    url: '/songs/parents/083-parents.mp3',
    duration: '3:52',
    genre: 'Folk',
    emotion: ['family', 'love'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-084',
    title: 'Lingering Touch',
    artist: 'Soft Distance',
    url: '/songs/parents/084-parents.mp3',
    duration: '4:15',
    genre: 'Acoustic',
    emotion: ['family', 'hope'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-085',
    title: 'Morning Stillness',
    artist: 'Noon Drift',
    url: '/songs/parents/085-parents.mp3',
    duration: '3:38',
    genre: 'Pop',
    emotion: ['family', 'nostalgia'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-086',
    title: 'Passing Clouds',
    artist: 'Calm Narrative',
    url: '/songs/parents/086-parents.mp3',
    duration: '4:12',
    genre: 'Folk',
    emotion: ['family', 'peace'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-087',
    title: 'Dusk Reflections',
    artist: 'Light Motion',
    url: '/songs/parents/087-parents.mp3',
    duration: '3:45',
    genre: 'Acoustic',
    emotion: ['family', 'gratitude'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-088',
    title: 'Hidden Warmth',
    artist: 'Silent Echoes',
    url: '/songs/parents/088-parents.mp3',
    duration: '4:05',
    genre: 'Pop',
    emotion: ['family', 'love'],
    appropriateFor: ['parents'],
    category: 'parents'
  },
  {
    id: 'parents-089',
    title: 'Light Through Curtains',
    artist: 'Warm Driftworks',
    url: '/songs/parents/089-parents.mp3',
    duration: '3:58',
    genre: 'Folk',
    emotion: ['family', 'hope'],
    appropriateFor: ['parents'],
    category: 'parents'
  },

  // Siblings Category (22 songs)
  {
    id: 'siblings-090',
    title: 'Soft Return',
    artist: 'Open Tone',
    url: '/songs/siblings/090-siblings.mp3',
    duration: '3:52',
    genre: 'Pop',
    emotion: ['family', 'friendship'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-091',
    title: 'Gentle Balance',
    artist: 'Soft Balance',
    url: '/songs/siblings/091-siblings.mp3',
    duration: '4:18',
    genre: 'Acoustic',
    emotion: ['family', 'nostalgia'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-092',
    title: 'Empty Pages',
    artist: 'Quiet Seasons',
    url: '/songs/siblings/092-siblings.mp3',
    duration: '3:35',
    genre: 'Folk',
    emotion: ['family', 'joy'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-093',
    title: 'Whispering Wind',
    artist: 'Gentle Pulse',
    url: '/songs/siblings/093-siblings.mp3',
    duration: '4:08',
    genre: 'Pop',
    emotion: ['family', 'peace'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-094',
    title: 'Familiar Silence',
    artist: 'Driftline Studio',
    url: '/songs/siblings/094-siblings.mp3',
    duration: '3:48',
    genre: 'Acoustic',
    emotion: ['family', 'hope'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-095',
    title: 'Peace Within',
    artist: 'Calm Shore',
    url: '/songs/siblings/095-siblings.mp3',
    duration: '4:22',
    genre: 'Folk',
    emotion: ['family', 'celebration'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-096',
    title: 'Subtle Motion',
    artist: 'Still Notes',
    url: '/songs/siblings/096-siblings.mp3',
    duration: '3:42',
    genre: 'Pop',
    emotion: ['family', 'nostalgia'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-097',
    title: 'Echoing Calm',
    artist: 'Subtle Canvas',
    url: '/songs/siblings/097-siblings.mp3',
    duration: '4:05',
    genre: 'Acoustic',
    emotion: ['family', 'joy'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-098',
    title: 'Slow Departure',
    artist: 'Echo Calm',
    url: '/songs/siblings/098-siblings.mp3',
    duration: '3:55',
    genre: 'Folk',
    emotion: ['family', 'peace'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-099',
    title: 'Gentle Path',
    artist: 'Soft Atmos',
    url: '/songs/siblings/099-siblings.mp3',
    duration: '4:18',
    genre: 'Pop',
    emotion: ['family', 'hope'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-100',
    title: 'Open Windows',
    artist: 'Warm Silence',
    url: '/songs/siblings/100-siblings.mp3',
    duration: '3:38',
    genre: 'Acoustic',
    emotion: ['family', 'celebration'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-101',
    title: 'Late Afternoon',
    artist: 'Quiet Structure',
    url: '/songs/siblings/101-siblings.mp3',
    duration: '4:12',
    genre: 'Folk',
    emotion: ['family', 'nostalgia'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-102',
    title: 'Distant Lanterns',
    artist: 'Noon Ambient',
    url: '/songs/siblings/102-siblings.mp3',
    duration: '3:45',
    genre: 'Pop',
    emotion: ['family', 'joy'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-103',
    title: 'Quiet Presence',
    artist: 'Drift Calm',
    url: '/songs/siblings/103-siblings.mp3',
    duration: '4:08',
    genre: 'Acoustic',
    emotion: ['family', 'peace'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-104',
    title: 'Shifting Light',
    artist: 'Gentle Frame',
    url: '/songs/siblings/104-siblings.mp3',
    duration: '3:52',
    genre: 'Folk',
    emotion: ['family', 'hope'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-105',
    title: 'Soft Arrival',
    artist: 'Silent Motion',
    url: '/songs/siblings/105-siblings.mp3',
    duration: '4:25',
    genre: 'Pop',
    emotion: ['family', 'celebration'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-106',
    title: 'Memory Bloom',
    artist: 'Lightpath Audio',
    url: '/songs/siblings/106-siblings.mp3',
    duration: '3:38',
    genre: 'Acoustic',
    emotion: ['family', 'nostalgia'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-107',
    title: 'Still Waiting',
    artist: 'Calm Space',
    url: '/songs/siblings/107-siblings.mp3',
    duration: '4:15',
    genre: 'Folk',
    emotion: ['family', 'joy'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-108',
    title: 'Warm Shadows',
    artist: 'Still Signal',
    url: '/songs/siblings/108-siblings.mp3',
    duration: '3:42',
    genre: 'Pop',
    emotion: ['family', 'peace'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-109',
    title: 'Calm Connection',
    artist: 'Soft Pattern',
    url: '/songs/siblings/109-siblings.mp3',
    duration: '4:05',
    genre: 'Acoustic',
    emotion: ['family', 'hope'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-110',
    title: 'Silent Embrace',
    artist: 'Quiet Phase',
    url: '/songs/siblings/110-siblings.mp3',
    duration: '3:55',
    genre: 'Folk',
    emotion: ['family', 'celebration'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },
  {
    id: 'siblings-111',
    title: 'Blue Reflections',
    artist: 'Warm Horizon',
    url: '/songs/siblings/111-siblings.mp3',
    duration: '4:18',
    genre: 'Pop',
    emotion: ['family', 'nostalgia'],
    appropriateFor: ['siblings'],
    category: 'siblings'
  },

  // Spouse Category (22 songs)
  {
    id: 'spouse-112',
    title: 'Evening Walk',
    artist: 'Ambient Fold',
    url: '/songs/spouse/112-spouse.mp3',
    duration: '3:45',
    genre: 'Romantic',
    emotion: ['love', 'peace'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-113',
    title: 'Gentle Passing',
    artist: 'Gentle Flow',
    url: '/songs/spouse/113-spouse.mp3',
    duration: '4:02',
    genre: 'Ambient',
    emotion: ['love', 'nostalgia'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-114',
    title: 'Fading Daylight',
    artist: 'Silent Layer',
    url: '/songs/spouse/114-spouse.mp3',
    duration: '3:38',
    genre: 'Classical',
    emotion: ['love', 'peace'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-115',
    title: 'Safe Harbor',
    artist: 'Calm Echo',
    url: '/songs/spouse/115-spouse.mp3',
    duration: '4:15',
    genre: 'Ambient',
    emotion: ['love', 'joy'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-116',
    title: 'Resting Thoughts',
    artist: 'Soft Current',
    url: '/songs/spouse/116-spouse.mp3',
    duration: '3:52',
    genre: 'Piano',
    emotion: ['love', 'hope'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-117',
    title: 'Open Skies',
    artist: 'Quiet Fieldworks',
    url: '/songs/spouse/117-spouse.mp3',
    duration: '4:28',
    genre: 'Ambient',
    emotion: ['love', 'celebration'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-118',
    title: 'Quiet Return',
    artist: 'Drift Bloom',
    url: '/songs/spouse/118-spouse.mp3',
    duration: '3:18',
    genre: 'Classical',
    emotion: ['love', 'nostalgia'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-119',
    title: 'Tender Space',
    artist: 'Warm Measure',
    url: '/songs/spouse/119-spouse.mp3',
    duration: '4:05',
    genre: 'Romantic',
    emotion: ['love', 'peace'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-120',
    title: 'Holding Still',
    artist: 'Open Calm',
    url: '/songs/spouse/120-spouse.mp3',
    duration: '3:48',
    genre: 'Ambient',
    emotion: ['love', 'joy'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-121',
    title: 'Light Between Us',
    artist: 'Still Passage',
    url: '/songs/spouse/121-spouse.mp3',
    duration: '4:12',
    genre: 'Classical',
    emotion: ['love', 'hope'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-122',
    title: 'Slow Tides',
    artist: 'Gentle Scene',
    url: '/songs/spouse/122-spouse.mp3',
    duration: '3:42',
    genre: 'Ambient',
    emotion: ['love', 'celebration'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-123',
    title: 'Silent Bloom',
    artist: 'Quiet Outline',
    url: '/songs/spouse/123-spouse.mp3',
    duration: '4:25',
    genre: 'Romantic',
    emotion: ['love', 'nostalgia'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-124',
    title: 'Kind Stillness',
    artist: 'Soft Drift',
    url: '/songs/spouse/124-spouse.mp3',
    duration: '3:38',
    genre: 'Classical',
    emotion: ['love', 'peace'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-125',
    title: 'Warm Drift',
    artist: 'Calm Loom',
    url: '/songs/spouse/125-spouse.mp3',
    duration: '4:08',
    genre: 'Ambient',
    emotion: ['love', 'joy'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-126',
    title: 'Calm Release',
    artist: 'Silent Shore',
    url: '/songs/spouse/126-spouse.mp3',
    duration: '3:52',
    genre: 'Piano',
    emotion: ['love', 'hope'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-127',
    title: 'Gentle Close',
    artist: 'Warm Room Audio',
    url: '/songs/spouse/127-spouse.mp3',
    duration: '4:15',
    genre: 'Romantic',
    emotion: ['love', 'celebration'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-128',
    title: 'Peaceful Trace',
    artist: 'Subtle Air',
    url: '/songs/spouse/128-spouse.mp3',
    duration: '3:45',
    genre: 'Ambient',
    emotion: ['love', 'nostalgia'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-129',
    title: 'Quiet Ending',
    artist: 'Gentle Trace',
    url: '/songs/spouse/129-spouse.mp3',
    duration: '4:22',
    genre: 'Classical',
    emotion: ['love', 'peace'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-130',
    title: 'Soft Farewell',
    artist: 'Quiet Motion',
    url: '/songs/spouse/130-spouse.mp3',
    duration: '3:58',
    genre: 'Romantic',
    emotion: ['love', 'joy'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-131',
    title: 'Distant Calm',
    artist: 'Soft Frameworks',
    url: '/songs/spouse/131-spouse.mp3',
    duration: '4:12',
    genre: 'Ambient',
    emotion: ['love', 'hope'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-132',
    title: 'Last Light',
    artist: 'Calm Fade',
    url: '/songs/spouse/132-spouse.mp3',
    duration: '3:42',
    genre: 'Classical',
    emotion: ['love', 'celebration'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  },
  {
    id: 'spouse-133',
    title: 'Home Again',
    artist: 'Still Haven',
    url: '/songs/spouse/133-spouse.mp3',
    duration: '4:18',
    genre: 'Romantic',
    emotion: ['love', 'peace'],
    appropriateFor: ['spouse'],
    category: 'spouse'
  }
]

export const getLocalSongsByCategory = (category: string): LocalSong[] => {
  return LOCAL_SONGS.filter(song => song.category === category)
}

export const getLocalSongsByRelationship = (relationship: string): LocalSong[] => {
  return LOCAL_SONGS.filter(song => song.appropriateFor.includes(relationship))
}

export const getAllLocalSongs = (): LocalSong[] => {
  return LOCAL_SONGS
}
