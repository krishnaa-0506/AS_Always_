'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Report {
  _id: string
  messageCode: string
  reason: string
  status: 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  timestamp: string
  messageDetails: {
    senderName: string
    receiverName: string
    relationship: string
    emotionTag: string
  }
  adminNote?: string
}

export default function ReportsPanel() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  
  // Enhanced filtering state
  const [advancedFilters, setAdvancedFilters] = useState({
    priority: '',
    startDate: '',
    endDate: '',
    keyword: ''
  })
  
  // Bulk actions state
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  
  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    fetchReports()
    fetchAnalytics()
  }, [filter, advancedFilters])

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter.toUpperCase())
      if (advancedFilters.priority) params.append('priority', advancedFilters.priority)
      if (advancedFilters.startDate) params.append('startDate', advancedFilters.startDate)
      if (advancedFilters.endDate) params.append('endDate', advancedFilters.endDate)
      if (advancedFilters.keyword) params.append('keyword', advancedFilters.keyword)
      
      const response = await fetch(`/api/admin/reports?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics/interactions?timeRange=30days')
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const updateReportStatus = async (reportId: string, status: string, note?: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: note })
      })
      
      if (response.ok) {
        fetchReports()
        setSelectedReport(null)
      }
    } catch (error) {
      console.error('Failed to update report:', error)
    }
  }

  const handleBulkAction = async (action: 'resolve' | 'dismiss') => {
    if (selectedReports.length === 0) return
    
    setBulkActionLoading(true)
    try {
      const response = await fetch('/api/admin/reports/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reportIds: selectedReports,
          status: action === 'resolve' ? 'RESOLVED' : 'DISMISSED'
        })
      })

      if (response.ok) {
        setSelectedReports([])
        fetchReports()
      }
    } catch (error) {
      console.error('Failed to perform bulk action:', error)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-800'
      case 'REVIEWING': return 'bg-blue-100 text-blue-800'
      case 'RESOLVED': return 'bg-green-100 text-green-800'
      case 'DISMISSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading reports...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Content Reports</h2>
        
        <div className="flex items-center space-x-4">
          {/* Analytics Toggle */}
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 Analytics
          </button>
          
          {/* Filter Tabs */}
          <div className="flex space-x-2">
            {['all', 'pending', 'resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  filter === tab
                    ? 'bg-white text-purple-600 font-medium'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab} ({reports.filter(r => tab === 'all' ? true : r.status.toLowerCase() === tab).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && analytics && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">📈 Interaction Analytics (30 days)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400">{analytics.reactions.total}</div>
              <div className="text-white/60">Total Reactions</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">{analytics.replies.total}</div>
              <div className="text-white/60">Total Replies</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-400">{analytics.reports.total}</div>
              <div className="text-white/60">Total Reports</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">{analytics.engagementRate}%</div>
              <div className="text-white/60">Engagement Rate</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Advanced Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Priority</label>
            <select
              value={advancedFilters.priority}
              onChange={(e) => setAdvancedFilters(prev => ({...prev, priority: e.target.value}))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm mb-2">From Date</label>
            <input
              type="date"
              value={advancedFilters.startDate}
              onChange={(e) => setAdvancedFilters(prev => ({...prev, startDate: e.target.value}))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm mb-2">To Date</label>
            <input
              type="date"
              value={advancedFilters.endDate}
              onChange={(e) => setAdvancedFilters(prev => ({...prev, endDate: e.target.value}))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm mb-2">Search</label>
            <input
              type="text"
              placeholder="Keyword in reason..."
              value={advancedFilters.keyword}
              onChange={(e) => setAdvancedFilters(prev => ({...prev, keyword: e.target.value}))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReports.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-600/20 border border-blue-400/20 rounded-lg p-4 flex items-center justify-between"
        >
          <span className="text-blue-200">
            {selectedReports.length} report{selectedReports.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex space-x-3">
            <button
              onClick={() => handleBulkAction('resolve')}
              disabled={bulkActionLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {bulkActionLoading ? 'Processing...' : '✅ Resolve All'}
            </button>
            <button
              onClick={() => handleBulkAction('dismiss')}
              disabled={bulkActionLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {bulkActionLoading ? 'Processing...' : '❌ Dismiss All'}
            </button>
            <button
              onClick={() => setSelectedReports([])}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              Clear Selection
            </button>
          </div>
        </motion.div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <div className="text-4xl mb-4">🎉</div>
            <p>No reports found. Community is safe!</p>
          </div>
        ) : (
          reports.map((report) => (
            <motion.div
              key={report._id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox for bulk selection */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report._id)}
                    onChange={() => toggleReportSelection(report._id)}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                  />
                </div>
                
                {/* Report content */}
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <span className="text-white/60 text-sm">
                      {new Date(report.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-white mb-2">
                    <strong>Reason:</strong> {report.reason}
                  </div>
                  
                  <div className="text-white/80 text-sm">
                    <strong>Message:</strong> {report.messageCode} | 
                    <span className="ml-1">{report.messageDetails.senderName} → {report.messageDetails.receiverName}</span> |
                    <span className="ml-1 capitalize">{report.messageDetails.relationship}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Report Details</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Report ID</label>
                <div className="text-gray-600 font-mono text-sm">{selectedReport._id}</div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Message Code</label>
                <div className="text-gray-600 font-mono">{selectedReport.messageCode}</div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Report Reason</label>
                <div className="text-gray-800 p-3 bg-gray-50 rounded-lg">{selectedReport.reason}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedReport.priority)}`}>
                    {selectedReport.priority}
                  </span>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Message Details</label>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                  <div><strong>Sender:</strong> {selectedReport.messageDetails.senderName}</div>
                  <div><strong>Receiver:</strong> {selectedReport.messageDetails.receiverName}</div>
                  <div><strong>Relationship:</strong> {selectedReport.messageDetails.relationship}</div>
                  <div><strong>Emotion:</strong> {selectedReport.messageDetails.emotionTag}</div>
                </div>
              </div>

              {selectedReport.adminNote && (
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Admin Note</label>
                  <div className="text-gray-800 p-3 bg-blue-50 rounded-lg">{selectedReport.adminNote}</div>
                </div>
              )}

              {selectedReport.status === 'PENDING' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => updateReportStatus(selectedReport._id, 'REVIEWING')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Review
                  </button>
                  <button
                    onClick={() => updateReportStatus(selectedReport._id, 'DISMISSED', 'No violation found')}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => updateReportStatus(selectedReport._id, 'RESOLVED', 'Content removed/action taken')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Take Action
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}