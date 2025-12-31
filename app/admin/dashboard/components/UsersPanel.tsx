import { useState, useEffect } from 'react'
import { User } from '@/lib/db/types'

interface UserWithStats extends User {
  id: string
  messageCount?: number
  isBlocked?: boolean
}

export default function UsersPanel() {
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  
  useEffect(() => {
    fetchUsers()
  }, [page])
  
  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/admin/users?page=${page}`, {
        headers: {
          'x-admin-secret': '306206'
        }
      })
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
        setTotalUsers(data.total)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': '306206'
        },
        body: JSON.stringify({ userId, role: newRole })
      })
      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const blockUser = async (userId: string) => {
    if (!confirm('Are you sure you want to block this user?')) return
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': '306206'
        },
        body: JSON.stringify({ userId, action: 'block' })
      })
      
      if (response.ok) {
        alert('User blocked successfully')
        fetchUsers()
      } else {
        alert('Failed to block user')
      }
    } catch (error) {
      console.error('Error blocking user:', error)
      alert('Error blocking user')
    }
  }

  const unblockUser = async (userId: string) => {
    if (!confirm('Are you sure you want to unblock this user?')) return
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': '306206'
        },
        body: JSON.stringify({ userId, action: 'unblock' })
      })
      
      if (response.ok) {
        alert('User unblocked successfully')
        fetchUsers()
      } else {
        alert('Failed to unblock user')
      }
    } catch (error) {
      console.error('Error unblocking user:', error)
      alert('Error unblocking user')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user and all their data? This cannot be undone.')) return
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-secret': '306206'
        },
        body: JSON.stringify({ userId })
      })
      
      if (response.ok) {
        alert('User deleted successfully')
        fetchUsers()
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }
  
  if (loading) return <div className="flex justify-center items-center p-8"><div className="text-gray-500">Loading users...</div></div>
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <div className="text-sm text-gray-500">Total: {totalUsers} users</div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className={user.isBlocked ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    disabled={user.isBlocked}
                  >
                    <option value="SENDER">Sender</option>
                    <option value="RECEIVER">Receiver</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isBlocked 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.messageCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {user.isBlocked ? (
                      <button
                        onClick={() => unblockUser(user.id)}
                        className="text-green-600 hover:text-green-900 px-2 py-1 border border-green-600 rounded text-xs"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => blockUser(user.id)}
                        className="text-yellow-600 hover:text-yellow-900 px-2 py-1 border border-yellow-600 rounded text-xs"
                      >
                        Block
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(user.id)}
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
      
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      )}
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing page {page} of users
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
            disabled={users.length < 10}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
