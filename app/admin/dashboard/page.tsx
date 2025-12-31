'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import CinematicBackground from '@/components/CinematicBackground'

interface DashboardStats {
  totalUsers: number
  totalMessages: number
  messagesViewed: number
  activeToday: number
  totalMemories: number
}

interface RecentActivity {
  id: string
  action: string
  user: string
  timestamp: string
  type: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMessages: 0,
    messagesViewed: 0,
    activeToday: 0,
    totalMemories: 0
  })

  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'messages' | 'analytics' | 'settings'>('overview')
  const [users, setUsers] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [systemLogs, setSystemLogs] = useState<string[]>([])
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    // Check admin authentication
    const adminAuth = sessionStorage.getItem('asalways-admin')
    if (adminAuth !== 'authenticated') {
      router.push('/admin/login')
      return
    }

    fetchAnalytics()
  }, [router])

  // Fetch real analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: {
          'x-admin-code': '306206'
        }
      })
      if (response.ok) {
        const result = await response.json()
        const data = result.data
        setStats({
          totalUsers: data.totalUsers || 0,
          totalMessages: data.totalMessages || 0,
          messagesViewed: data.viewedMessages || 0,
          activeToday: data.recentUsers || 0,
          totalMemories: data.totalMemories || 0
        })

        // Generate recent activity from real data
        const activities: RecentActivity[] = []
        if (data.recentMessages > 0) {
          activities.push({
            id: '1',
            action: `${data.recentMessages} new messages created`,
            user: 'System',
            timestamp: 'Today',
            type: 'message'
          })
        }
        if (data.recentUsers > 0) {
          activities.push({
            id: '2',
            action: `${data.recentUsers} new users registered`,
            user: 'System',
            timestamp: 'Today',
            type: 'user'
          })
        }
        if (data.viewedMessages > 0) {
          activities.push({
            id: '3',
            action: `${data.viewedMessages} messages viewed`,
            user: 'System',
            timestamp: 'Total',
            type: 'message'
          })
        }
        setRecentActivity(activities)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-admin-code': '306206'
        },
        credentials: 'include'
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        console.error('Failed to fetch users:', response.status, data)
        setUsers([])
        return
      }

      const list = data?.users ?? data?.data?.users ?? []
      setUsers(Array.isArray(list) ? list : [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const fetchMessages = async () => {
    setIsLoadingMessages(true)
    try {
      const response = await fetch('/api/admin/messages', {
        headers: {
          'x-admin-code': '306206'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this memory?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-code': '306206'
        },
        body: JSON.stringify({ messageId })
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchMessages()
      } else {
        const errorData = await response.json()
        alert('Error: ' + errorData.error)
      }
    } catch (error) {
      alert('Failed to delete message')
    }
  }

  const blockUser = async (userId: string, action: 'block' | 'unblock') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-code': '306206'
        },
        body: JSON.stringify({ userId, action })
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchUsers()
      } else {
        const errorData = await response.json()
        alert('Error: ' + errorData.error)
      }
    } catch (error) {
      alert('Failed to update user')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user and ALL their data? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-code': '306206'
        },
        body: JSON.stringify({ userId })
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchUsers()
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert('Error: ' + errorData.error)
      }
    } catch (error) {
      alert('Failed to delete user')
    }
  }

  useEffect(() => {
    if (selectedTab === 'users') {
      fetchUsers()
    } else if (selectedTab === 'messages') {
      fetchMessages()
    }
  }, [selectedTab])

  const handleLogout = () => {
    sessionStorage.removeItem('asalways-admin')
    router.push('/role-selection')
  }

  const performSystemAction = async (action: string, actionName: string) => {
    try {
      const response = await fetch('/api/admin/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-code': '306206'
        },
        body: JSON.stringify({ action })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        
        // Handle specific actions
        if (action === 'export_all_data') {
          // Download JSON, Users CSV, and Messages CSV
          if (data.data.jsonData) {
            downloadFile(data.data.jsonData, data.data.jsonFilename, 'application/json')
          }
          if (data.data.usersCSV) {
            downloadFile(data.data.usersCSV, data.data.usersCSVFilename, 'text/csv')
          }
          if (data.data.messagesCSV) {
            downloadFile(data.data.messagesCSV, data.data.messagesCSVFilename, 'text/csv')
          }
        } else if (action === 'backup_database') {
          // Trigger download
          downloadFile(data.data.backupData, data.data.filename, 'application/json')
        } else if (action === 'view_logs') {
          setSystemLogs(data.data.logs)
          setShowLogs(true)
        }
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      alert(`Failed to ${actionName}`)
    }
  }

  const downloadFile = (data: any, filename: string, mimeType: string = 'application/json') => {
    const content = mimeType === 'text/csv' ? data : JSON.stringify(data, null, 2)
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'messages', label: 'Messages', icon: '💌' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return '💌'
      case 'user': return '👤'
      case 'system': return '⚡'
      default: return '📝'
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CinematicBackground />
      
      <div className="relative z-10 px-4 py-8 pt-16">
        <div className="max-w-7xl mx-auto">

          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className="text-4xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ⚙️
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-cinematic text-white">
                  Admin Dashboard
                </h1>
                <p className="text-white/70">AsAlways Platform Management</p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚪 Logout
            </motion.button>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            className="flex flex-wrap gap-2 mb-8 bg-white/10 rounded-2xl p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {selectedTab === 'overview' && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <motion.div 
                  className="glass-panel p-6 text-center"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl text-blue-400 mb-2">👥</div>
                  <div className="text-2xl font-bold text-white">
                    {isLoadingStats ? '...' : stats.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Total Users</div>
                </motion.div>

                <motion.div 
                  className="glass-panel p-6 text-center"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl text-pink-400 mb-2">💌</div>
                  <div className="text-2xl font-bold text-white">
                    {isLoadingStats ? '...' : stats.totalMessages.toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Messages Created</div>
                </motion.div>

                <motion.div 
                  className="glass-panel p-6 text-center"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl text-green-400 mb-2">👀</div>
                  <div className="text-2xl font-bold text-white">
                    {isLoadingStats ? '...' : stats.messagesViewed.toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Messages Viewed</div>
                </motion.div>

                <motion.div 
                  className="glass-panel p-6 text-center"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl text-orange-400 mb-2">⚡</div>
                  <div className="text-2xl font-bold text-white">
                    {isLoadingStats ? '...' : stats.activeToday}
                  </div>
                  <div className="text-white/60 text-sm">New Users Today</div>
                </motion.div>

                <motion.div 
                  className="glass-panel p-6 text-center"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl text-purple-400 mb-2">💝</div>
                  <div className="text-2xl font-bold text-white">
                    {isLoadingStats ? '...' : stats.totalMemories || 0}
                  </div>
                  <div className="text-white/60 text-sm">Total Memories</div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="glass-panel p-6">
                <h3 className="text-xl font-cinematic text-white mb-4 flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {isLoadingStats ? (
                    <div className="text-center py-4 text-white/60">Loading activity...</div>
                  ) : recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{activity.action}</div>
                          <div className="text-white/60 text-sm">by {activity.user}</div>
                        </div>
                        <div className="text-white/50 text-xs">{activity.timestamp}</div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-white/60">No recent activity</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'users' && (
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-cinematic text-white flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    User Management ({users.length} users)
                  </h3>
                  <button
                    onClick={fetchUsers}
                    className="btn-secondary flex items-center gap-2"
                    disabled={isLoadingUsers}
                  >
                    <span>🔄</span>
                    {isLoadingUsers ? 'Loading...' : 'Refresh'}
                  </button>
                </div>

                {isLoadingUsers ? (
                  <div className="text-center py-8 text-white/60">Loading users...</div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div key={user._id} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <div className="text-white font-semibold">{user.email}</div>
                          <div className="text-white/60 text-sm">
                            Created: {new Date(user.createdAt).toLocaleDateString()} • 
                            Memories: {user.stats?.totalMessages || 0} • 
                            Status: {user.isBlocked ? '🔴 Blocked' : '🟢 Active'}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => blockUser(user._id, user.isBlocked ? 'unblock' : 'block')}
                            className={`px-3 py-1 rounded text-sm ${user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="px-3 py-1 bg-red-800 hover:bg-red-900 text-white rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <div className="text-center py-8 text-white/40">No users found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'messages' && (
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-cinematic text-white flex items-center gap-3">
                    <span className="text-2xl">💌</span>
                    Memory Management ({messages.length} memories)
                  </h3>
                  <button
                    onClick={fetchMessages}
                    className="btn-secondary flex items-center gap-2"
                    disabled={isLoadingMessages}
                  >
                    <span>🔄</span>
                    {isLoadingMessages ? 'Loading...' : 'Refresh'}
                  </button>
                </div>

                {isLoadingMessages ? (
                  <div className="text-center py-8 text-white/60">Loading memories...</div>
                ) : (
                  <div className="space-y-4">
                    {messages.slice(0, 10).map((message: any) => (
                      <div key={message._id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-white font-semibold">Memory #{message.code}</div>
                            <div className="text-white/60 text-sm">
                              From: {message.senderName} → To: {message.receiverName} • 
                              Created: {new Date(message.createdAt).toLocaleDateString()} •
                              Views: {message.isViewed ? '1' : '0'} •
                              Status: {message.status}
                            </div>
                            {message.relationship && (
                              <div className="text-white/40 text-xs mt-1">Relationship: {message.relationship}</div>
                            )}
                          </div>
                          <button
                            onClick={() => deleteMessage(message._id)}
                            className="px-3 py-1 bg-red-800 hover:bg-red-900 text-white rounded text-sm ml-4"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center py-8 text-white/40">No memories found</div>
                    )}
                    {messages.length > 10 && (
                      <div className="text-center py-4 text-white/60">
                        Showing first 10 of {messages.length} memories
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <h3 className="text-xl font-cinematic text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  Analytics Dashboard
                </h3>
                
                {/* Bar Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Messages Over Time Chart */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">Messages Created</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-white/10 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${Math.min((stats.totalMessages / Math.max(stats.totalMessages, 1)) * 100, 100)}%` }}
                          >
                            <span className="text-white text-xs font-bold">{stats.totalMessages}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Rate Chart */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">View Rate</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-white/10 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${stats.totalMessages > 0 ? Math.min((stats.messagesViewed / stats.totalMessages) * 100, 100) : 0}%` }}
                          >
                            <span className="text-white text-xs font-bold">
                              {stats.totalMessages > 0 ? ((stats.messagesViewed / stats.totalMessages) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Memory Usage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Memories Created</span>
                        <span className="text-white">{stats.totalMemories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Memories Viewed</span>
                        <span className="text-white">{stats.messagesViewed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">View Rate</span>
                        <span className="text-white">{stats.totalMemories > 0 ? ((stats.messagesViewed / stats.totalMemories) * 100).toFixed(1) : 0}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">User Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Users</span>
                        <span className="text-white">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Active Today</span>
                        <span className="text-white">{stats.activeToday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Avg Memories per User</span>
                        <span className="text-white">{stats.totalUsers > 0 ? (stats.totalMemories / stats.totalUsers).toFixed(1) : 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Charts */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
                    <div className="text-white/60 text-sm">Total Messages</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">👀</div>
                    <div className="text-2xl font-bold text-white">{stats.messagesViewed}</div>
                    <div className="text-white/60 text-sm">Viewed</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                    <div className="text-white/60 text-sm">Total Users</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <h3 className="text-xl font-cinematic text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  System Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <button 
                      onClick={() => performSystemAction('clean_orphaned_files', 'clean orphaned files')}
                      className="w-full btn-secondary"
                    >
                      Clean Orphaned Files
                    </button>
                    <button 
                      onClick={() => performSystemAction('clear_cache', 'clear cache')}
                      className="w-full btn-secondary"
                    >
                      Clear Cache
                    </button>
                    <button 
                      onClick={() => performSystemAction('export_all_data', 'export all data')}
                      className="w-full btn-secondary"
                    >
                      Export All Data
                    </button>
                  </div>
                  <div className="space-y-4">
                    <button 
                      onClick={() => window.location.reload()}
                      className="w-full btn-primary"
                    >
                      Refresh System
                    </button>
                    <button 
                      onClick={() => performSystemAction('view_logs', 'view logs')}
                      className="w-full btn-secondary"
                    >
                      View Logs
                    </button>
                    <button 
                      onClick={() => performSystemAction('backup_database', 'backup database')}
                      className="w-full btn-secondary"
                    >
                      Backup Database
                    </button>
                  </div>
                </div>

                {showLogs && (
                  <div className="mt-8 glass-panel p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-white font-semibold">System Logs</h4>
                      <button 
                        onClick={() => setShowLogs(false)}
                        className="text-white/60 hover:text-white"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                      {systemLogs.map((logGroup: any, index) => (
                        <div key={index} className="mb-4">
                          <div className="text-orange-400 font-semibold mb-2">{logGroup.file}</div>
                          {logGroup.lines.map((line: string, lineIndex: number) => (
                            <div key={lineIndex} className="text-white/70 text-sm font-mono">
                              {line}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}