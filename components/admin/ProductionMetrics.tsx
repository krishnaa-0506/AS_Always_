'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  CurrencyRupeeIcon, 
  UsersIcon, 
  ServerIcon,
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  CpuChipIcon,
  CircleStackIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface Metrics {
  system: {
    uptime: number
    memoryUsage: NodeJS.MemoryUsage
    environment: string
  }
  database: {
    totalUsers: number
    totalMessages: number
    totalPayments: number
    storageStats: any
  }
  performance: {
    avgResponseTime: number
    errorRate: number
    requestCount: number
  }
  revenue: {
    totalRevenue: number
    monthlyRevenue: number
    pendingPayments: number
  }
}

export default function ProductionMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics')
      const data = await response.json()
      if (data.success) {
        setMetrics(data.metrics)
        setLastUpdated(new Date(data.timestamp))
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const executeAction = async (action: string) => {
    try {
      const response = await fetch('/api/admin/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message)
        fetchMetrics()
      }
    } catch (error) {
      console.error('Error executing action:', error)
    }
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!metrics) return null

  const stats = [
    {
      name: 'Total Revenue',
      value: `₹${metrics.revenue.totalRevenue.toLocaleString()}`,
      icon: CurrencyRupeeIcon,
      color: 'from-green-500 to-emerald-500',
      subtitle: `₹${metrics.revenue.monthlyRevenue} this month`
    },
    {
      name: 'Total Users',
      value: metrics.database.totalUsers.toLocaleString(),
      icon: UsersIcon,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'Registered accounts'
    },
    {
      name: 'Messages Created',
      value: metrics.database.totalMessages.toLocaleString(),
      icon: DocumentChartBarIcon,
      color: 'from-purple-500 to-pink-500',
      subtitle: 'Total memories'
    },
    {
      name: 'System Uptime',
      value: formatUptime(metrics.system.uptime),
      icon: ServerIcon,
      color: 'from-orange-500 to-red-500',
      subtitle: metrics.system.environment
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Production Metrics</h2>
          <p className="text-white/60 text-sm">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <motion.button
          onClick={fetchMetrics}
          className="btn-secondary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowPathIcon className="w-4 h-4" />
          Refresh
        </motion.button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/40 text-xs">{stat.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance & System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <ChartBarIcon className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-semibold text-white">Performance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Request Count (24h)</span>
              <span className="text-white font-semibold">{metrics.performance.requestCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Error Rate</span>
              <span className={`font-semibold ${metrics.performance.errorRate > 5 ? 'text-red-400' : 'text-green-400'}`}>
                {metrics.performance.errorRate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Pending Payments</span>
              <span className="text-yellow-400 font-semibold">{metrics.revenue.pendingPayments}</span>
            </div>
          </div>
        </motion.div>

        {/* System Resources */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <CpuChipIcon className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">System Resources</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Memory (Heap Used)</span>
              <span className="text-white font-semibold">
                {formatBytes(metrics.system.memoryUsage.heapUsed)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Memory (Heap Total)</span>
              <span className="text-white font-semibold">
                {formatBytes(metrics.system.memoryUsage.heapTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">External Memory</span>
              <span className="text-white font-semibold">
                {formatBytes(metrics.system.memoryUsage.external)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Storage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <CircleStackIcon className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Storage Statistics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/60 text-sm mb-2">Total Files</p>
            <p className="text-2xl font-bold text-white">
              {metrics.database.storageStats.overall?.totalFiles || 0}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/60 text-sm mb-2">Total Size</p>
            <p className="text-2xl font-bold text-white">
              {formatBytes(metrics.database.storageStats.overall?.totalSize || 0)}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/60 text-sm mb-2">Average File Size</p>
            <p className="text-2xl font-bold text-white">
              {formatBytes(metrics.database.storageStats.overall?.averageSize || 0)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Maintenance Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Maintenance Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            onClick={() => executeAction('cleanup_storage')}
            className="btn-secondary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrashIcon className="w-4 h-4" />
            Clean Orphaned Files
          </motion.button>
          <motion.button
            onClick={() => executeAction('cleanup_expired_otps')}
            className="btn-secondary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrashIcon className="w-4 h-4" />
            Clean Expired OTPs
          </motion.button>
          <motion.button
            onClick={() => executeAction('clear_cache')}
            className="btn-secondary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowPathIcon className="w-4 h-4" />
            Clear Cache
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}