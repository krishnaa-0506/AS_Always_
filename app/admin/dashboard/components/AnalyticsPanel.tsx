import { useState, useEffect } from 'react'

type AnalyticsData = {
  totalUsers: number
  totalMessages: number
  totalMemories: number
  totalReactions: number
  recentUsers: number
  recentMessages: number
  viewedMessages: number
  viewRate: number
}

export default function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30') // days
  
  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])
  
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?days=${timeframe}`, {
        headers: {
          'x-admin-secret': '306206'
        }
      })
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <div>Loading analytics...</div>
  if (!data) return <div>No data available</div>
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Platform Analytics</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          change={data.recentUsers}
          timeframe={timeframe}
          icon="👥"
        />
        <StatCard
          title="Total Messages"
          value={data.totalMessages}
          change={data.recentMessages}
          timeframe={timeframe}
          icon="💌"
        />
        <StatCard
          title="Total Memories"
          value={data.totalMemories}
          icon="💝"
        />
        <StatCard
          title="Total Reactions"
          value={data.totalReactions}
          icon="❤️"
        />
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Message Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-medium mb-2">View Rate</h4>
            <div className="text-3xl font-bold">
              {data.viewRate.toFixed(1)}%
              <span className="text-sm text-gray-500 ml-2">of messages viewed</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {data.viewedMessages} out of {data.totalMessages} messages
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-medium mb-2">Memory Usage</h4>
            <div className="text-3xl font-bold">
              {(data.totalMemories / (data.totalMessages || 1)).toFixed(1)}
              <span className="text-sm text-gray-500 ml-2">memories per message</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type StatCardProps = {
  title: string
  value: number
  change?: number
  timeframe?: string
  icon: string
}

function StatCard({ title, value, change, timeframe, icon }: StatCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="text-3xl font-bold">{value.toLocaleString()}</div>
      {change !== undefined && (
        <div className="mt-2 text-sm">
          <span className={change > 0 ? 'text-green-600' : 'text-gray-600'}>
            +{change} new in last {timeframe} days
          </span>
        </div>
      )}
    </div>
  )
}
