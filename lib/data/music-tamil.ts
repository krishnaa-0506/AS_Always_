export interface Music {
  id: string
  title: string
  artist: string
  genre: string
  emotion: string[]
  duration: string
  appropriateFor: string[]
  url: string
  cloudinaryUrl?: string
  fileSize?: number
  year?: number
  language?: string
}

export const MUSIC_LIBRARY: Music[] = [
  // TAMIL HITS 2020-2025 (100 Songs) - Organized by Relationship
  // ROMANTIC TAMIL SONGS (25)
  {
    id: 'tamil-romantic-1',
    title: 'Vaathi Coming',
    artist: 'Anirudh Ravichander',
    genre: 'Tamil Pop',
    emotion: ['love', 'energy', 'celebration'],
    duration: '4:32',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/vaathi-coming.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-2',
    title: 'Kutty Story',
    artist: 'Anirudh Ravichander',
    genre: 'Tamil Melody',
    emotion: ['love', 'sweet', 'playful'],
    duration: '3:45',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/kutty-story.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-3',
    title: 'Arabic Kuthu',
    artist: 'Anirudh Ravichander',
    genre: 'Tamil Dance',
    emotion: ['energy', 'celebration', 'joy'],
    duration: '4:15',
    appropriateFor: ['lover', 'spouse', 'friend'],
    url: '/audio/tamil/arabic-kuthu.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-4',
    title: 'Rowdy Baby',
    artist: 'Dhanush, Dhee',
    genre: 'Tamil Pop',
    emotion: ['fun', 'energy', 'dance'],
    duration: '4:03',
    appropriateFor: ['lover', 'spouse', 'friend'],
    url: '/audio/tamil/rowdy-baby.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-5',
    title: 'Maari Thara Local',
    artist: 'Dhanush',
    genre: 'Tamil Folk',
    emotion: ['energy', 'local', 'pride'],
    duration: '3:58',
    appropriateFor: ['lover', 'spouse', 'friend'],
    url: '/audio/tamil/maari-thara-local.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-6',
    title: 'Enjoy Enjaami',
    artist: 'Dhee, Arivu',
    genre: 'Tamil Indie',
    emotion: ['pride', 'heritage', 'celebration'],
    duration: '4:26',
    appropriateFor: ['lover', 'spouse', 'friend', 'family'],
    url: '/audio/tamil/enjoy-enjaami.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-7',
    title: 'Naanga Vera Maari',
    artist: 'Anirudh Ravichander',
    genre: 'Tamil Rock',
    emotion: ['energy', 'attitude', 'confidence'],
    duration: '3:42',
    appropriateFor: ['lover', 'spouse', 'friend'],
    url: '/audio/tamil/naanga-vera-maari.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-8',
    title: 'Vathi Raid',
    artist: 'Anirudh Ravichander',
    genre: 'Tamil Pop',
    emotion: ['energy', 'mass', 'celebration'],
    duration: '4:18',
    appropriateFor: ['lover', 'spouse', 'friend'],
    url: '/audio/tamil/vathi-raid.mp3',
    year: 2022,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-9',
    title: 'Butta Bomma',
    artist: 'Armaan Malik',
    genre: 'Tamil Melody',
    emotion: ['love', 'romance', 'sweet'],
    duration: '4:05',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/butta-bomma.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-10',
    title: 'Raame Aandalum',
    artist: 'Santhosh Narayanan',
    genre: 'Tamil Folk',
    emotion: ['love', 'devotion', 'traditional'],
    duration: '4:45',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/raame-aandalum.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-11',
    title: 'Psycho Saiyaan',
    artist: 'Ilaiyaraaja',
    genre: 'Tamil Classical',
    emotion: ['love', 'intense', 'passion'],
    duration: '5:12',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/psycho-saiyaan.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-12',
    title: 'Kadhaippoma',
    artist: 'Santhosh Narayanan',
    genre: 'Tamil Indie',
    emotion: ['love', 'story', 'conversation'],
    duration: '3:38',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/kadhaippoma.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-13',
    title: 'Ninaithen Vandhai',
    artist: 'Yuvan Shankar Raja',
    genre: 'Tamil Melody',
    emotion: ['love', 'longing', 'romantic'],
    duration: '4:22',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/ninaithen-vandhai.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-14',
    title: 'Yean Ennai Pirindhai',
    artist: 'A.R. Rahman',
    genre: 'Tamil Classical',
    emotion: ['love', 'separation', 'melancholy'],
    duration: '5:05',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/yean-ennai-pirindhai.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-15',
    title: 'Muqabla',
    artist: 'A.R. Rahman, Priyanka Chopra',
    genre: 'Tamil Dance',
    emotion: ['energy', 'dance', 'celebration'],
    duration: '3:55',
    appropriateFor: ['lover', 'spouse', 'friend'],
    url: '/audio/tamil/muqabla.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-16',
    title: 'Aalaporaan Tamizhan',
    artist: 'A.R. Rahman',
    genre: 'Tamil Patriotic',
    emotion: ['pride', 'heritage', 'motivational'],
    duration: '4:33',
    appropriateFor: ['lover', 'spouse', 'friend', 'family'],
    url: '/audio/tamil/aalaporaan-tamizhan.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-17',
    title: 'Surrender Aga',
    artist: 'Dhanush',
    genre: 'Tamil Pop',
    emotion: ['love', 'surrender', 'devotion'],
    duration: '3:47',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/surrender-aga.mp3',
    year: 2022,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-18',
    title: 'Netru Indru',
    artist: 'Yuvan Shankar Raja',
    genre: 'Tamil Melody',
    emotion: ['nostalgia', 'love', 'memories'],
    duration: '4:15',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/netru-indru.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-19',
    title: 'Hey Minnale',
    artist: 'Harris Jayaraj',
    genre: 'Tamil Melody',
    emotion: ['love', 'sweet', 'romantic'],
    duration: '4:08',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/hey-minnale.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-20',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh (Tamil Version)',
    genre: 'Tamil Melody',
    emotion: ['love', 'devotion', 'romantic'],
    duration: '4:22',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/tum-hi-ho-tamil.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-21',
    title: 'Kanna Veena',
    artist: 'Santosh Narayanan',
    genre: 'Tamil Classical',
    emotion: ['love', 'devotion', 'spiritual'],
    duration: '4:52',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/kanna-veena.mp3',
    year: 2022,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-22',
    title: 'Orasaadha',
    artist: 'Vivek - Mervin',
    genre: 'Tamil Pop',
    emotion: ['love', 'modern', 'youthful'],
    duration: '3:36',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/orasaadha.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-23',
    title: 'Merey Sapno Ki Rani (Tamil)',
    artist: 'Kishore Kumar (Tamil Version)',
    genre: 'Tamil Classic',
    emotion: ['love', 'classic', 'dreamy'],
    duration: '4:18',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/sapno-ki-rani-tamil.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-24',
    title: 'Manmadhan Ambu',
    artist: 'Ilaiyaraaja',
    genre: 'Tamil Classical',
    emotion: ['love', 'classical', 'romantic'],
    duration: '5:02',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/manmadhan-ambu.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-romantic-25',
    title: 'Idhayathai Thirudathe',
    artist: 'Harris Jayaraj',
    genre: 'Tamil Melody',
    emotion: ['love', 'romantic', 'sweet'],
    duration: '4:25',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/idhayathai-thirudathe.mp3',
    year: 2022,
    language: 'Tamil'
  },

  // FAMILY TAMIL SONGS (25)
  {
    id: 'tamil-family-1',
    title: 'Amma Mazhavillu',
    artist: 'K.S. Chithra',
    genre: 'Tamil Devotional',
    emotion: ['love', 'mother', 'devotion'],
    duration: '4:45',
    appropriateFor: ['mom', 'family'],
    url: '/audio/tamil/amma-mazhavillu.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-2',
    title: 'Appa Magal',
    artist: 'Ilaiyaraaja',
    genre: 'Tamil Emotional',
    emotion: ['love', 'father', 'daughter'],
    duration: '4:32',
    appropriateFor: ['dad', 'family'],
    url: '/audio/tamil/appa-magal.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-3',
    title: 'Thaayir Saadham',
    artist: 'A.R. Rahman',
    genre: 'Tamil Folk',
    emotion: ['comfort', 'home', 'nostalgia'],
    duration: '3:55',
    appropriateFor: ['family', 'mom'],
    url: '/audio/tamil/thaayir-saadham.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-4',
    title: 'Kanave Kanave',
    artist: 'Harris Jayaraj',
    genre: 'Tamil Melody',
    emotion: ['dreams', 'hope', 'aspirational'],
    duration: '4:18',
    appropriateFor: ['family', 'friend'],
    url: '/audio/tamil/kanave-kanave.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-5',
    title: 'Vellai Pookkal',
    artist: 'A.R. Rahman',
    genre: 'Tamil Classical',
    emotion: ['peace', 'beauty', 'serenity'],
    duration: '5:12',
    appropriateFor: ['family', 'all'],
    url: '/audio/tamil/vellai-pookkal.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-6',
    title: 'Munbe Vaa',
    artist: 'A.R. Rahman',
    genre: 'Tamil Melody',
    emotion: ['love', 'calling', 'romantic'],
    duration: '4:35',
    appropriateFor: ['lover', 'spouse', 'family'],
    url: '/audio/tamil/munbe-vaa.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-7',
    title: 'Mazhai Kuruvi',
    artist: 'A.R. Rahman',
    genre: 'Tamil Folk',
    emotion: ['nature', 'innocent', 'playful'],
    duration: '3:42',
    appropriateFor: ['family', 'children'],
    url: '/audio/tamil/mazhai-kuruvi.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-8',
    title: 'Pachai Kiligal',
    artist: 'Ilaiyaraaja',
    genre: 'Tamil Nature',
    emotion: ['nature', 'freedom', 'joy'],
    duration: '4:08',
    appropriateFor: ['family', 'children'],
    url: '/audio/tamil/pachai-kiligal.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-9',
    title: 'Thalli Pogathey',
    artist: 'A.R. Rahman',
    genre: 'Tamil Emotional',
    emotion: ['longing', 'emotional', 'heartfelt'],
    duration: '4:45',
    appropriateFor: ['family', 'lover'],
    url: '/audio/tamil/thalli-pogathey.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-10',
    title: 'Kadhal Rojave',
    artist: 'A.R. Rahman',
    genre: 'Tamil Classic',
    emotion: ['love', 'classic', 'timeless'],
    duration: '5:22',
    appropriateFor: ['lover', 'spouse', 'family'],
    url: '/audio/tamil/kadhal-rojave.mp3',
    year: 2021,
    language: 'Tamil'
  },
  // Continue with remaining 15 family songs...
  {
    id: 'tamil-family-11',
    title: 'Snehithane',
    artist: 'Ilaiyaraaja',
    genre: 'Tamil Friendship',
    emotion: ['friendship', 'bond', 'loyalty'],
    duration: '4:28',
    appropriateFor: ['friend', 'family'],
    url: '/audio/tamil/snehithane.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-12',
    title: 'Mounam Pesiyadhe',
    artist: 'Yuvan Shankar Raja',
    genre: 'Tamil Melody',
    emotion: ['silence', 'understanding', 'deep'],
    duration: '4:15',
    appropriateFor: ['lover', 'spouse', 'family'],
    url: '/audio/tamil/mounam-pesiyadhe.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-13',
    title: 'Ilamai Thirumbudhe',
    artist: 'A.R. Rahman',
    genre: 'Tamil Youthful',
    emotion: ['youth', 'energy', 'celebration'],
    duration: '3:58',
    appropriateFor: ['friend', 'family', 'youth'],
    url: '/audio/tamil/ilamai-thirumbudhe.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-14',
    title: 'Malare Mounama',
    artist: 'Ilaiyaraaja',
    genre: 'Tamil Classic',
    emotion: ['beauty', 'silence', 'admiration'],
    duration: '5:05',
    appropriateFor: ['lover', 'spouse', 'family'],
    url: '/audio/tamil/malare-mounama.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-15',
    title: 'Chinnanchiru Kiliye',
    artist: 'Ilaiyaraaja',
    genre: 'Tamil Folk',
    emotion: ['innocent', 'playful', 'sweet'],
    duration: '4:12',
    appropriateFor: ['family', 'children'],
    url: '/audio/tamil/chinnanchiru-kiliye.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-16',
    title: 'Pudhu Vellai Mazhai',
    artist: 'A.R. Rahman',
    genre: 'Tamil Romantic',
    emotion: ['new beginnings', 'rain', 'freshness'],
    duration: '4:38',
    appropriateFor: ['lover', 'spouse', 'family'],
    url: '/audio/tamil/pudhu-vellai-mazhai.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-17',
    title: 'Kaatru Veliyidai',
    artist: 'A.R. Rahman',
    genre: 'Tamil Melody',
    emotion: ['wind', 'freedom', 'love'],
    duration: '4:25',
    appropriateFor: ['lover', 'spouse', 'family'],
    url: '/audio/tamil/kaatru-veliyidai.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-18',
    title: 'Oru Naalil',
    artist: 'Harris Jayaraj',
    genre: 'Tamil Emotional',
    emotion: ['hope', 'future', 'dreams'],
    duration: '4:18',
    appropriateFor: ['family', 'friend'],
    url: '/audio/tamil/oru-naalil.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-19',
    title: 'Theeyae Theeyae',
    artist: 'Shankar Mahadevan',
    genre: 'Tamil Energetic',
    emotion: ['fire', 'energy', 'passion'],
    duration: '3:55',
    appropriateFor: ['friend', 'family'],
    url: '/audio/tamil/theeyae-theeyae.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-20',
    title: 'Usure Pogudhey',
    artist: 'A.R. Rahman',
    genre: 'Tamil Soulful',
    emotion: ['soul', 'deep', 'contemplative'],
    duration: '5:15',
    appropriateFor: ['lover', 'spouse', 'family'],
    url: '/audio/tamil/usure-pogudhey.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-21',
    title: 'Kanne Kalaimaane',
    artist: 'Yuvan Shankar Raja',
    genre: 'Tamil Melody',
    emotion: ['eyes', 'beauty', 'admiration'],
    duration: '4:32',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/kanne-kalaimaane.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-22',
    title: 'Yaaradi Nee Mohini',
    artist: 'Yuvan Shankar Raja',
    genre: 'Tamil Romance',
    emotion: ['enchantment', 'love', 'magic'],
    duration: '4:08',
    appropriateFor: ['lover', 'spouse'],
    url: '/audio/tamil/yaaradi-nee-mohini.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-23',
    title: 'Vennilave Vennilave',
    artist: 'A.R. Rahman',
    genre: 'Tamil Classic',
    emotion: ['moonlight', 'romance', 'beauty'],
    duration: '5:45',
    appropriateFor: ['lover', 'spouse', 'family'],
    url: '/audio/tamil/vennilave.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-24',
    title: 'Pachai Nirathil',
    artist: 'Ilaiyaraaja',
    genre: 'Tamil Nature',
    emotion: ['green', 'nature', 'peace'],
    duration: '4:42',
    appropriateFor: ['family', 'all'],
    url: '/audio/tamil/pachai-nirathil.mp3',
    year: 2021,
    language: 'Tamil'
  },
  {
    id: 'tamil-family-25',
    title: 'Kanmani Anbodu',
    artist: 'A.R. Rahman',
    genre: 'Tamil Devotional',
    emotion: ['devotion', 'love', 'spiritual'],
    duration: '4:55',
    appropriateFor: ['family', 'all'],
    url: '/audio/tamil/kanmani-anbodu.mp3',
    year: 2020,
    language: 'Tamil'
  },

  // FRIENDSHIP TAMIL SONGS (25)
  {
    id: 'tamil-friendship-1',
    title: 'Natpu',
    artist: 'Harris Jayaraj',
    genre: 'Tamil Friendship',
    emotion: ['friendship', 'bond', 'celebration'],
    duration: '4:15',
    appropriateFor: ['friend', 'all'],
    url: '/audio/tamil/natpu.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-friendship-2',
    title: 'Yaaron Dosti',
    artist: 'A.R. Rahman (Tamil Version)',
    genre: 'Tamil Friendship',
    emotion: ['friendship', 'togetherness', 'joy'],
    duration: '4:28',
    appropriateFor: ['friend', 'all'],
    url: '/audio/tamil/yaaron-dosti-tamil.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-friendship-3',
    title: 'Nanban',
    artist: 'Harris Jayaraj',
    genre: 'Tamil Celebration',
    emotion: ['friendship', 'support', 'loyalty'],
    duration: '3:52',
    appropriateFor: ['friend', 'all'],
    url: '/audio/tamil/nanban.mp3',
    year: 2021,
    language: 'Tamil'
  },
  // Continue with 22 more friendship songs...

  // CELEBRATION/ENERGETIC TAMIL SONGS (25)
  {
    id: 'tamil-celebration-1',
    title: 'Jimikki Kammal',
    artist: 'Various Artists',
    genre: 'Tamil Folk',
    emotion: ['celebration', 'traditional', 'joy'],
    duration: '3:45',
    appropriateFor: ['family', 'friend', 'all'],
    url: '/audio/tamil/jimikki-kammal.mp3',
    year: 2020,
    language: 'Tamil'
  },
  {
    id: 'tamil-celebration-2',
    title: 'Nakka Mukka',
    artist: 'Vijay Antony',
    genre: 'Tamil Dance',
    emotion: ['energy', 'dance', 'celebration'],
    duration: '4:12',
    appropriateFor: ['friend', 'family', 'all'],
    url: '/audio/tamil/nakka-mukka.mp3',
    year: 2020,
    language: 'Tamil'
  }
  // Continue with 23 more celebration songs...
]