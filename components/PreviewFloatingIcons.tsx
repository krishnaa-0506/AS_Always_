import { motion } from 'framer-motion'
import { Sparkles, Heart, Star, Flower, Sun, Moon, Cloud, Rainbow, Leaf, Flame, Snowflake, Droplet, Music, Smile, ThumbsUp } from 'lucide-react'

const ICONS = [
  Sparkles, Heart, Star, Flower, Sun, Moon, Cloud, Rainbow, Leaf, Flame, Snowflake, Droplet, Music, Smile, ThumbsUp
]

const COLORS = [
  'text-pink-400', 'text-yellow-300', 'text-blue-400', 'text-green-400', 'text-purple-400',
  'text-orange-400', 'text-emerald-400', 'text-cyan-400', 'text-fuchsia-400', 'text-rose-400',
  'text-indigo-400', 'text-lime-400', 'text-sky-400', 'text-red-400', 'text-violet-400'
]

export default function PreviewFloatingIcons({ screenIndex = 0 }: { screenIndex?: number }) {
  // Pick 5 icons per screen, rotate colors
  const icons = Array.from({ length: 5 }, (_, i) => {
    const Icon = ICONS[(screenIndex + i) % ICONS.length]
    const color = COLORS[(screenIndex * 3 + i * 2) % COLORS.length]
    const delay = Math.random() * 2
    const duration = 6 + Math.random() * 4
    return (
      <motion.div
        key={i}
        className={`absolute z-0 ${color}`}
        style={{
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
          opacity: 0.5 + Math.random() * 0.4,
        }}
        initial={{ scale: 0.7, rotate: 0, y: 0 }}
        animate={{ scale: [0.7, 1.2, 0.7], rotate: [0, 360], y: [-20, 20, -20] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
      >
        <Icon size={36 + Math.random() * 24} />
      </motion.div>
    )
  })
  return <>{icons}</>
}
