import { useState } from 'react'
import { Template, Theme } from '@/lib/db/types'

export default function SettingsPanel() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(false)
  
  const handleThemeToggle = async (themeId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/themes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId, isActive })
      })
      if (response.ok) {
        setThemes(themes.map(theme => 
          theme.id === themeId ? { ...theme, isActive } : theme
        ))
      }
    } catch (error) {
      console.error('Error updating theme:', error)
    }
  }
  
  const handleTemplateToggle = async (templateId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, isActive })
      })
      if (response.ok) {
        setTemplates(templates.map(template => 
          template.id === templateId ? { ...template, isActive } : template
        ))
      }
    } catch (error) {
      console.error('Error updating template:', error)
    }
  }
  
  const seedData = async () => {
    setLoading(true)
    try {
      await fetch('/api/admin/seed', { method: 'POST' })
      // Refresh data after seeding
      const [templatesRes, themesRes] = await Promise.all([
        fetch('/api/admin/templates').then(r => r.json()),
        fetch('/api/admin/themes').then(r => r.json())
      ])
      setTemplates(templatesRes.templates)
      setThemes(themesRes.themes)
    } catch (error) {
      console.error('Error seeding data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
      
      <div className="space-y-8">
        {/* Templates Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Message Templates</h3>
            <button
              onClick={seedData}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Seed Templates & Themes'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={template.isActive}
                      onChange={(e) => handleTemplateToggle(template.id, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
                <div className="mt-2 text-sm text-gray-500">Category: {template.category}</div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Themes Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Message Themes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map(theme => (
              <div key={theme.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{theme.name}</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={theme.isActive}
                      onChange={(e) => handleThemeToggle(theme.id, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">{theme.description}</p>
                <div className="mt-2">
                  <div className="h-8 rounded" style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* System Settings */}
        <section>
          <h3 className="text-xl font-semibold mb-4">System Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Message Generation</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Enable AI Content Generation</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Allow Memory Uploads</span>
                </label>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">User Features</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Allow Voice Notes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Enable Background Music</span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
