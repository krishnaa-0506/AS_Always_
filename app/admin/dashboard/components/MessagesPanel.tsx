import { useState, useEffect } from 'react'
import { Message } from '@/lib/db/types'

interface MessageWithDetails extends Message {
  id: string
  memoriesCount?: number
  screensCount?: number
}

export default function MessagesPanel() {
  const [messages, setMessages] = useState<MessageWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalMessages, setTotalMessages] = useState(0)
  
  useEffect(() => {
    fetchMessages()
  }, [page])
  
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/admin/messages?page=${page}`, {
        headers: {
          'x-admin-secret': '306206'
        }
      })
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
        setTotalMessages(data.total)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleStatusUpdate = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': '306206'
        },
        body: JSON.stringify({ messageId, status: newStatus })
      })
      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  }

  const deleteMessage = async (messageId: string, code: string) => {
    if (!confirm(`Are you sure you want to permanently delete message ${code} and all its related data? This cannot be undone.`)) return
    
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': '306206'
        },
        body: JSON.stringify({ messageId })
      })
      
      if (response.ok) {
        alert('Message deleted successfully')
        fetchMessages()
      } else {
        alert('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Error deleting message')
    }
  }

  const viewMessage = (code: string) => {
    window.open(`/receiver?code=${code}`, '_blank')
  }
  
  if (loading) return <div className="flex justify-center items-center p-8"><div className="text-gray-500">Loading messages...</div></div>
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Messages Management</h2>
        <div className="text-sm text-gray-500">Total: {totalMessages} messages</div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map(message => (
              <tr key={message.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{message.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div><strong>From:</strong> {message.senderName}</div>
                    <div><strong>To:</strong> {message.receiverName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Memories: {message.memoriesCount || 0}</div>
                    <div>Screens: {message.screensCount || 0}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={message.status}
                    onChange={(e) => handleStatusUpdate(message.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="CREATED">Created</option>
                    <option value="GENERATED">Generated</option>
                    <option value="SENT">Sent</option>
                    <option value="VIEWED">Viewed</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(message.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => viewMessage(message.code)}
                      className="text-blue-600 hover:text-blue-900 px-2 py-1 border border-blue-600 rounded text-xs"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => deleteMessage(message.id, message.code)}
                      className="text-red-600 hover:text-red-900 px-2 py-1 border border-red-600 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {messages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No messages found
        </div>
      )}
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing page {page} of messages
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={messages.length < 10}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
