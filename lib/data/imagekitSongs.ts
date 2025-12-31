// ImageKit Songs Data - All songs uploaded to ImageKit CDN
export interface Song {
  id: string;
  title: string;
  url: string;
  category: string;
  fileId: string;
  artist?: string;
  genre?: string;
  emotion?: string;
  duration?: string;
}

// Songs organized by category with ImageKit URLs
export const imagekitSongs = {
  friends: [
    { id: "001-friends", title: "Silent Promise", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/001-friends.mp3", category: "friends", fileId: "friends_001", artist: "Luma Trails", genre: "acoustic", emotion: "friendship", duration: "3:45" },
    { id: "002-friends", title: "After the Rain", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/002-friends.mp3", category: "friends", fileId: "friends_002", artist: "SoftFrame", genre: "piano", emotion: "joy", duration: "4:12" },
    { id: "003-friends", title: "Fading Letters", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/003-friends.mp3", category: "friends", fileId: "friends_003", artist: "Echo Harbor", genre: "folk", emotion: "nostalgia", duration: "3:28" },
    { id: "004-friends", title: "Moonlight Drift", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/004-friends.mp3", category: "friends", fileId: "friends_004", artist: "Stillwave", genre: "acoustic", emotion: "friendship", duration: "4:05" },
    { id: "005-friends", title: "Gentle Goodbye", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/005-friends.mp3", category: "friends", fileId: "friends_005", artist: "Pale Horizon", genre: "piano", emotion: "joy", duration: "3:52" },
    { id: "006-friends", title: "Echoes of Home", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/006-friends.mp3", category: "friends", fileId: "friends_006", artist: "Quiet Field", genre: "ambient", emotion: "peace", duration: "4:18" },
    { id: "007-friends", title: "Last Train Memory", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/007-friends.mp3", category: "friends", fileId: "friends_007", artist: "Drift Notes", genre: "folk", emotion: "nostalgia", duration: "3:35" },
    { id: "008-friends", title: "Warm Window Lights", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/008-friends.mp3", category: "friends", fileId: "friends_008", artist: "Calm Atlas", genre: "acoustic", emotion: "friendship", duration: "4:22" },
    { id: "009-friends", title: "Stillness Between Us", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/009-friends.mp3", category: "friends", fileId: "friends_009", artist: "Gentle Axis", genre: "piano", emotion: "peace", duration: "3:48" },
    { id: "010-friends", title: "Unspoken Feelings", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/010-friends.mp3", category: "friends", fileId: "friends_010", artist: "Slow Ember", genre: "ambient", emotion: "hope", duration: "4:15" },
    { id: "011-friends", title: "Soft Horizons", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/011-friends.mp3", category: "friends", fileId: "friends_011", artist: "Noonlight Studio", genre: "folk", emotion: "joy", duration: "3:58" },
    { id: "012-friends", title: "Midnight Thoughts", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/012-friends.mp3", category: "friends", fileId: "friends_012", artist: "Silent Coast", genre: "acoustic", emotion: "friendship", duration: "4:08" },
    { id: "013-friends", title: "Floating Petals", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/013-friends.mp3", category: "friends", fileId: "friends_013", artist: "Warm Canvas", genre: "piano", emotion: "nostalgia", duration: "3:42" },
    { id: "014-friends", title: "Calm Before Dawn", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/014-friends.mp3", category: "friends", fileId: "friends_014", artist: "Floating Tone", genre: "ambient", emotion: "peace", duration: "4:25" },
    { id: "015-friends", title: "Empty Benches", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/015-friends.mp3", category: "friends", fileId: "friends_015", artist: "Low Tide Audio", genre: "folk", emotion: "joy", duration: "3:38" },
    { id: "016-friends", title: "Time Slows Down", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/016-friends.mp3", category: "friends", fileId: "friends_016", artist: "Whisper Lane", genre: "acoustic", emotion: "friendship", duration: "4:12" },
    { id: "017-friends", title: "Whispered Hopes", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/017-friends.mp3", category: "friends", fileId: "friends_017", artist: "Open Air Ensemble", genre: "piano", emotion: "hope", duration: "3:55" },
    { id: "018-friends", title: "Long Walk Back", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/018-friends.mp3", category: "friends", fileId: "friends_018", artist: "Faint Signal", genre: "ambient", emotion: "peace", duration: "4:20" },
    { id: "019-friends", title: "Fragile Moments", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/019-friends.mp3", category: "friends", fileId: "friends_019", artist: "Pastel Soundworks", genre: "folk", emotion: "nostalgia", duration: "3:48" },
    { id: "020-friends", title: "Golden Silence", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/020-friends.mp3", category: "friends", fileId: "friends_020", artist: "Calm Current", genre: "acoustic", emotion: "joy", duration: "4:05" },
    { id: "021-friends", title: "Falling Sky", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/021-friends.mp3", category: "friends", fileId: "friends_021", artist: "Soft Loom", genre: "piano", emotion: "friendship", duration: "3:52" },
    { id: "022-friends", title: "Blue Hour", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/022-friends.mp3", category: "friends", fileId: "friends_022", artist: "Subtle Motion Lab", genre: "ambient", emotion: "hope", duration: "4:18" },
    { id: "023-friends", title: "Quiet Heartbeats", url: "https://ik.imagekit.io/n31diav73/asalways/songs/friends/023-friends.mp3", category: "friends", fileId: "friends_023", artist: "Golden Static", genre: "folk", emotion: "nostalgia", duration: "3:45" }
  ],
  
  lover: [
    { id: "024-lover", title: "When Words Fade", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/024-lover.mp3", category: "lover", fileId: "lover_024", artist: "Ambient Room", genre: "romantic", emotion: "love", duration: "4:15" },
    { id: "025-lover", title: "Slow Breathing", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/025-lover.mp3", category: "lover", fileId: "lover_025", artist: "Quiet Theory", genre: "pop", emotion: "joy", duration: "3:52" },
    { id: "026-lover", title: "Familiar Streets", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/026-lover.mp3", category: "lover", fileId: "lover_026", artist: "Slow Pattern", genre: "acoustic", emotion: "peace", duration: "4:28" },
    { id: "027-lover", title: "Gentle Waves", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/027-lover.mp3", category: "lover", fileId: "lover_027", artist: "Lightfall Collective", genre: "romantic", emotion: "hope", duration: "3:38" },
    { id: "028-lover", title: "Waiting Season", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/028-lover.mp3", category: "lover", fileId: "lover_028", artist: "Hollow Frame", genre: "pop", emotion: "celebration", duration: "4:05" },
    { id: "029-lover", title: "Soft Footsteps", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/029-lover.mp3", category: "lover", fileId: "lover_029", artist: "Serene Echo", genre: "acoustic", emotion: "nostalgia", duration: "3:48" },
    { id: "030-lover", title: "Shared Umbrella", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/030-lover.mp3", category: "lover", fileId: "lover_030", artist: "Still Drift", genre: "romantic", emotion: "peace", duration: "4:18" },
    { id: "031-lover", title: "Peaceful Corners", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/031-lover.mp3", category: "lover", fileId: "lover_031", artist: "Noon Glow", genre: "pop", emotion: "joy", duration: "3:55" },
    { id: "032-lover", title: "Hidden Smiles", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/032-lover.mp3", category: "lover", fileId: "lover_032", artist: "Blue Distance", genre: "acoustic", emotion: "hope", duration: "4:12" },
    { id: "033-lover", title: "Distant Lullaby", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/033-lover.mp3", category: "lover", fileId: "lover_033", artist: "Gentle Loop", genre: "romantic", emotion: "celebration", duration: "3:42" },
    { id: "034-lover", title: "Tender Reflections", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/034-lover.mp3", category: "lover", fileId: "lover_034", artist: "Open Window Audio", genre: "pop", emotion: "nostalgia", duration: "4:25" },
    { id: "035-lover", title: "Low Light Dreams", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/035-lover.mp3", category: "lover", fileId: "lover_035", artist: "Calm Measure", genre: "acoustic", emotion: "peace", duration: "3:38" },
    { id: "036-lover", title: "Warm Memories", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/036-lover.mp3", category: "lover", fileId: "lover_036", artist: "Silent Path", genre: "romantic", emotion: "joy", duration: "4:08" },
    { id: "037-lover", title: "Soft Gravity", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/037-lover.mp3", category: "lover", fileId: "lover_037", artist: "Drift Ensemble", genre: "pop", emotion: "hope", duration: "3:52" },
    { id: "038-lover", title: "Half-Open Letters", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/038-lover.mp3", category: "lover", fileId: "lover_038", artist: "Warm Signal", genre: "acoustic", emotion: "celebration", duration: "4:15" },
    { id: "039-lover", title: "Between Two Hearts", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/039-lover.mp3", category: "lover", fileId: "lover_039", artist: "Fading Tone", genre: "romantic", emotion: "nostalgia", duration: "3:45" },
    { id: "040-lover", title: "Evening Calm", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/040-lover.mp3", category: "lover", fileId: "lover_040", artist: "Quiet Bloom", genre: "pop", emotion: "peace", duration: "4:22" },
    { id: "041-lover", title: "Quiet Reunion", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/041-lover.mp3", category: "lover", fileId: "lover_041", artist: "Soft Outline", genre: "acoustic", emotion: "joy", duration: "3:58" },
    { id: "042-lover", title: "Subtle Joy", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/042-lover.mp3", category: "lover", fileId: "lover_042", artist: "Low Light Studio", genre: "romantic", emotion: "hope", duration: "4:12" },
    { id: "043-lover", title: "Window Seat", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/043-lover.mp3", category: "lover", fileId: "lover_043", artist: "Peaceform", genre: "pop", emotion: "celebration", duration: "3:38" },
    { id: "044-lover", title: "Pastel Skies", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/044-lover.mp3", category: "lover", fileId: "lover_044", artist: "Motionless Sound", genre: "acoustic", emotion: "nostalgia", duration: "4:05" },
    { id: "045-lover", title: "Still Water", url: "https://ik.imagekit.io/n31diav73/asalways/songs/lover/045-lover.mp3", category: "lover", fileId: "lover_045", artist: "Calm Thread", genre: "romantic", emotion: "peace", duration: "3:52" }
  ],
  
  parents: [
    { id: "068-parents", title: "Breathing Space", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/068-parents.mp3", category: "parents", fileId: "parents_068", artist: "Still Air Audio", genre: "folk", emotion: "gratitude", duration: "4:18" },
    { id: "069-parents", title: "Small Miracles", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/069-parents.mp3", category: "parents", fileId: "parents_069", artist: "Open Silence", genre: "acoustic", emotion: "love", duration: "3:45" },
    { id: "070-parents", title: "Slow Sunrise", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/070-parents.mp3", category: "parents", fileId: "parents_070", artist: "Gentle Frequency", genre: "pop", emotion: "nostalgia", duration: "4:08" },
    { id: "071-parents", title: "Holding Time", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/071-parents.mp3", category: "parents", fileId: "parents_071", artist: "Subtle Horizon", genre: "folk", emotion: "peace", duration: "3:52" },
    { id: "072-parents", title: "Faint Echo", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/072-parents.mp3", category: "parents", fileId: "parents_072", artist: "Quiet Room Project", genre: "acoustic", emotion: "gratitude", duration: "4:25" },
    { id: "073-parents", title: "Soft Horizons II", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/073-parents.mp3", category: "parents", fileId: "parents_073", artist: "Soft Passage", genre: "pop", emotion: "love", duration: "3:38" },
    { id: "074-parents", title: "Gentle Awakening", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/074-parents.mp3", category: "parents", fileId: "parents_074", artist: "Warm Phase", genre: "folk", emotion: "hope", duration: "4:12" },
    { id: "075-parents", title: "Silent Roads", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/075-parents.mp3", category: "parents", fileId: "parents_075", artist: "Silent Lines", genre: "acoustic", emotion: "nostalgia", duration: "3:55" },
    { id: "076-parents", title: "Memory Lines", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/076-parents.mp3", category: "parents", fileId: "parents_076", artist: "Driftfield", genre: "pop", emotion: "peace", duration: "4:18" },
    { id: "077-parents", title: "Calm Arrival", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/077-parents.mp3", category: "parents", fileId: "parents_077", artist: "Calm Spectrum", genre: "folk", emotion: "gratitude", duration: "3:42" },
    { id: "078-parents", title: "Late Night Glow", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/078-parents.mp3", category: "parents", fileId: "parents_078", artist: "Ambient Atlas", genre: "acoustic", emotion: "love", duration: "4:05" },
    { id: "079-parents", title: "Thoughtful Pause", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/079-parents.mp3", category: "parents", fileId: "parents_079", artist: "Pale Sound", genre: "pop", emotion: "hope", duration: "3:48" },
    { id: "080-parents", title: "Floating Lights", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/080-parents.mp3", category: "parents", fileId: "parents_080", artist: "Stillform", genre: "folk", emotion: "nostalgia", duration: "4:22" },
    { id: "081-parents", title: "Safe Distance", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/081-parents.mp3", category: "parents", fileId: "parents_081", artist: "Echo Frame", genre: "acoustic", emotion: "peace", duration: "3:35" },
    { id: "082-parents", title: "Quiet Comfort", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/082-parents.mp3", category: "parents", fileId: "parents_082", artist: "Gentle Rise", genre: "pop", emotion: "gratitude", duration: "4:08" },
    { id: "083-parents", title: "Open Fields", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/083-parents.mp3", category: "parents", fileId: "parents_083", artist: "Quiet Layers", genre: "folk", emotion: "love", duration: "3:52" },
    { id: "084-parents", title: "Lingering Touch", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/084-parents.mp3", category: "parents", fileId: "parents_084", artist: "Soft Distance", genre: "acoustic", emotion: "hope", duration: "4:15" },
    { id: "085-parents", title: "Morning Stillness", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/085-parents.mp3", category: "parents", fileId: "parents_085", artist: "Noon Drift", genre: "pop", emotion: "nostalgia", duration: "3:38" },
    { id: "086-parents", title: "Passing Clouds", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/086-parents.mp3", category: "parents", fileId: "parents_086", artist: "Calm Narrative", genre: "folk", emotion: "peace", duration: "4:12" },
    { id: "087-parents", title: "Dusk Reflections", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/087-parents.mp3", category: "parents", fileId: "parents_087", artist: "Light Motion", genre: "acoustic", emotion: "gratitude", duration: "3:45" },
    { id: "088-parents", title: "Hidden Warmth", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/088-parents.mp3", category: "parents", fileId: "parents_088", artist: "Silent Echoes", genre: "pop", emotion: "love", duration: "4:05" },
    { id: "089-parents", title: "Light Through Curtains", url: "https://ik.imagekit.io/n31diav73/asalways/songs/parents/089-parents.mp3", category: "parents", fileId: "parents_089", artist: "Warm Driftworks", genre: "folk", emotion: "hope", duration: "3:58" }
  ],
  
  siblings: [
    { id: "090-siblings", title: "Soft Return", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/090-siblings.mp3", category: "siblings", fileId: "siblings_090", artist: "Open Tone", genre: "pop", emotion: "friendship", duration: "3:52" },
    { id: "091-siblings", title: "Gentle Balance", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/091-siblings.mp3", category: "siblings", fileId: "siblings_091", artist: "Soft Balance", genre: "acoustic", emotion: "nostalgia", duration: "4:18" },
    { id: "092-siblings", title: "Empty Pages", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/092-siblings.mp3", category: "siblings", fileId: "siblings_092", artist: "Quiet Seasons", genre: "folk", emotion: "joy", duration: "3:35" },
    { id: "093-siblings", title: "Whispering Wind", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/093-siblings.mp3", category: "siblings", fileId: "siblings_093", artist: "Gentle Pulse", genre: "pop", emotion: "peace", duration: "4:08" },
    { id: "094-siblings", title: "Familiar Silence", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/094-siblings.mp3", category: "siblings", fileId: "siblings_094", artist: "Driftline Studio", genre: "acoustic", emotion: "hope", duration: "3:48" },
    { id: "095-siblings", title: "Peace Within", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/095-siblings.mp3", category: "siblings", fileId: "siblings_095", artist: "Calm Shore", genre: "folk", emotion: "celebration", duration: "4:22" },
    { id: "096-siblings", title: "Subtle Motion", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/096-siblings.mp3", category: "siblings", fileId: "siblings_096", artist: "Still Notes", genre: "pop", emotion: "nostalgia", duration: "3:42" },
    { id: "097-siblings", title: "Echoing Calm", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/097-siblings.mp3", category: "siblings", fileId: "siblings_097", artist: "Subtle Canvas", genre: "acoustic", emotion: "joy", duration: "4:05" },
    { id: "098-siblings", title: "Slow Departure", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/098-siblings.mp3", category: "siblings", fileId: "siblings_098", artist: "Echo Calm", genre: "folk", emotion: "peace", duration: "3:55" },
    { id: "099-siblings", title: "Gentle Path", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/099-siblings.mp3", category: "siblings", fileId: "siblings_099", artist: "Soft Atmos", genre: "pop", emotion: "hope", duration: "4:18" },
    { id: "100-siblings", title: "Open Windows", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/100-siblings.mp3", category: "siblings", fileId: "siblings_100", artist: "Warm Silence", genre: "acoustic", emotion: "celebration", duration: "3:38" },
    { id: "101-siblings", title: "Late Afternoon", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/101-siblings.mp3", category: "siblings", fileId: "siblings_101", artist: "Quiet Structure", genre: "folk", emotion: "nostalgia", duration: "4:12" },
    { id: "102-siblings", title: "Distant Lanterns", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/102-siblings.mp3", category: "siblings", fileId: "siblings_102", artist: "Noon Ambient", genre: "pop", emotion: "joy", duration: "3:45" },
    { id: "103-siblings", title: "Quiet Presence", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/103-siblings.mp3", category: "siblings", fileId: "siblings_103", artist: "Drift Calm", genre: "acoustic", emotion: "peace", duration: "4:08" },
    { id: "104-siblings", title: "Shifting Light", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/104-siblings.mp3", category: "siblings", fileId: "siblings_104", artist: "Gentle Frame", genre: "folk", emotion: "hope", duration: "3:52" },
    { id: "105-siblings", title: "Soft Arrival", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/105-siblings.mp3", category: "siblings", fileId: "siblings_105", artist: "Silent Motion", genre: "pop", emotion: "celebration", duration: "4:25" },
    { id: "106-siblings", title: "Memory Bloom", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/106-siblings.mp3", category: "siblings", fileId: "siblings_106", artist: "Lightpath Audio", genre: "acoustic", emotion: "nostalgia", duration: "3:38" },
    { id: "107-siblings", title: "Still Waiting", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/107-siblings.mp3", category: "siblings", fileId: "siblings_107", artist: "Calm Space", genre: "folk", emotion: "joy", duration: "4:15" },
    { id: "108-siblings", title: "Warm Shadows", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/108-siblings.mp3", category: "siblings", fileId: "siblings_108", artist: "Still Signal", genre: "pop", emotion: "peace", duration: "3:42" },
    { id: "109-siblings", title: "Calm Connection", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/109-siblings.mp3", category: "siblings", fileId: "siblings_109", artist: "Soft Pattern", genre: "acoustic", emotion: "hope", duration: "4:05" },
    { id: "110-siblings", title: "Silent Embrace", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/110-siblings.mp3", category: "siblings", fileId: "siblings_110", artist: "Quiet Phase", genre: "folk", emotion: "celebration", duration: "3:55" },
    { id: "111-siblings", title: "Blue Reflections", url: "https://ik.imagekit.io/n31diav73/asalways/songs/siblings/111-siblings.mp3", category: "siblings", fileId: "siblings_111", artist: "Warm Horizon", genre: "pop", emotion: "nostalgia", duration: "4:18" }
  ],
  
  spouse: [
    { id: "046-spouse", title: "Evening Walk", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/046-spouse.mp3", category: "spouse", fileId: "spouse_046", artist: "Ambient Fold", genre: "romantic", emotion: "peace", duration: "3:45" },
    { id: "047-spouse", title: "Gentle Passing", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/047-spouse.mp3", category: "spouse", fileId: "spouse_047", artist: "Gentle Flow", genre: "ambient", emotion: "nostalgia", duration: "4:02" },
    { id: "048-spouse", title: "Fading Daylight", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/048-spouse.mp3", category: "spouse", fileId: "spouse_048", artist: "Silent Layer", genre: "classical", emotion: "peace", duration: "3:38" },
    { id: "049-spouse", title: "Safe Harbor", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/049-spouse.mp3", category: "spouse", fileId: "spouse_049", artist: "Calm Echo", genre: "ambient", emotion: "joy", duration: "4:15" },
    { id: "050-spouse", title: "Resting Thoughts", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/050-spouse.mp3", category: "spouse", fileId: "spouse_050", artist: "Soft Current", genre: "piano", emotion: "hope", duration: "3:52" },
    { id: "052-spouse", title: "Open Skies", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/052-spouse.mp3", category: "spouse", fileId: "spouse_052", artist: "Quiet Fieldworks", genre: "ambient", emotion: "celebration", duration: "4:28" },
    { id: "053-spouse", title: "Quiet Return", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/053-spouse.mp3", category: "spouse", fileId: "spouse_053", artist: "Drift Bloom", genre: "classical", emotion: "nostalgia", duration: "3:18" },
    { id: "054-spouse", title: "Tender Space", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/054-spouse.mp3", category: "spouse", fileId: "spouse_054", artist: "Warm Measure", genre: "romantic", emotion: "peace", duration: "4:05" },
    { id: "055-spouse", title: "Holding Still", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/055-spouse.mp3", category: "spouse", fileId: "spouse_055", artist: "Open Calm", genre: "ambient", emotion: "joy", duration: "3:48" },
    { id: "056-spouse", title: "Light Between Us", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/056-spouse.mp3", category: "spouse", fileId: "spouse_056", artist: "Still Passage", genre: "classical", emotion: "hope", duration: "4:12" },
    { id: "057-spouse", title: "Slow Tides", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/057-spouse.mp3", category: "spouse", fileId: "spouse_057", artist: "Gentle Scene", genre: "ambient", emotion: "celebration", duration: "3:42" },
    { id: "058-spouse", title: "Silent Bloom", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/058-spouse.mp3", category: "spouse", fileId: "spouse_058", artist: "Quiet Outline", genre: "romantic", emotion: "nostalgia", duration: "4:25" },
    { id: "059-spouse", title: "Kind Stillness", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/059-spouse.mp3", category: "spouse", fileId: "spouse_059", artist: "Soft Drift", genre: "classical", emotion: "peace", duration: "3:38" },
    { id: "060-spouse", title: "Warm Drift", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/060-spouse.mp3", category: "spouse", fileId: "spouse_060", artist: "Calm Loom", genre: "ambient", emotion: "joy", duration: "4:08" },
    { id: "061-spouse", title: "Calm Release", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/061-spouse.mp3", category: "spouse", fileId: "spouse_061", artist: "Silent Shore", genre: "piano", emotion: "hope", duration: "3:52" },
    { id: "062-spouse", title: "Gentle Close", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/062-spouse.mp3", category: "spouse", fileId: "spouse_062", artist: "Warm Room Audio", genre: "romantic", emotion: "celebration", duration: "4:15" },
    { id: "063-spouse", title: "Peaceful Trace", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/063-spouse.mp3", category: "spouse", fileId: "spouse_063", artist: "Subtle Air", genre: "ambient", emotion: "nostalgia", duration: "3:45" },
    { id: "064-spouse", title: "Quiet Ending", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/064-spouse.mp3", category: "spouse", fileId: "spouse_064", artist: "Gentle Trace", genre: "classical", emotion: "peace", duration: "4:22" },
    { id: "065-spouse", title: "Soft Farewell", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/065-spouse.mp3", category: "spouse", fileId: "spouse_065", artist: "Quiet Motion", genre: "romantic", emotion: "joy", duration: "3:58" },
    { id: "066-spouse", title: "Distant Calm", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/066-spouse.mp3", category: "spouse", fileId: "spouse_066", artist: "Soft Frameworks", genre: "ambient", emotion: "hope", duration: "4:12" },
    { id: "067-spouse", title: "Last Light", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/067-spouse.mp3", category: "spouse", fileId: "spouse_067", artist: "Calm Fade", genre: "classical", emotion: "celebration", duration: "3:42" },
    { id: "112-spouse", title: "Home Again", url: "https://ik.imagekit.io/n31diav73/asalways/songs/spouse/112-spouse.mp3", category: "spouse", fileId: "spouse_112", artist: "Still Haven", genre: "romantic", emotion: "peace", duration: "4:18" }
  ]
};

// Helper function to get songs by category
export function getSongsByCategory(category: keyof typeof imagekitSongs): Song[] {
  return imagekitSongs[category] || [];
}

// Helper function to get all songs
export function getAllSongs(): Song[] {
  return Object.values(imagekitSongs).flat();
}

// Helper function to get random song from category
export function getRandomSong(category: keyof typeof imagekitSongs): Song | null {
  const songs = getSongsByCategory(category);
  if (songs.length === 0) return null;
  return songs[Math.floor(Math.random() * songs.length)];
}

// Helper function to get multiple random songs from category
export function getRandomSongs(category: keyof typeof imagekitSongs, count: number): Song[] {
  const songs = getSongsByCategory(category);
  if (songs.length === 0) return [];
  
  const shuffled = [...songs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, songs.length));
}

export default imagekitSongs;
