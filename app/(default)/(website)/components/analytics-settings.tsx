import { useState } from 'react'
import { Card } from './card'
import { UpdateWebsiteDataType } from '@/schemas/update-website'

type AnalyticsSettingsProps = {
  data: UpdateWebsiteDataType
  handleDataUpdate: (data: Partial<UpdateWebsiteDataType>) => void
}

export const AnalyticsSettings = ({ data, handleDataUpdate }: AnalyticsSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    googleAnalyticsId: data.googleAnalyticsId || '',
    searchConsoleId: data.searchConsoleId || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    setFormData({
      googleAnalyticsId: data.googleAnalyticsId || '',
      searchConsoleId: data.searchConsoleId || ''
    })
    setIsEditing(false)
  }

  const handleSave = () => {
    handleDataUpdate({
      googleAnalyticsId: formData.googleAnalyticsId || undefined,
      searchConsoleId: formData.searchConsoleId || undefined
    })
    setIsEditing(false)
  }

  return (
    <Card title="Google Analytics & Search Console">
      <div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-6 right-6 btn py-1 bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Edit
          </button>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Google Analytics ID
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="googleAnalyticsId"
                  value={formData.googleAnalyticsId}
                  onChange={handleChange}
                  placeholder="G-XXXXXXXXXX"
                  className="form-input w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Format: G-XXXXXXXXXX. Used for collecting website traffic statistics.
                </p>
              </div>
            ) : (
              <p className="text-slate-900 dark:text-slate-100 font-semibold">
                {formData.googleAnalyticsId || "Not configured"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Google Search Console
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="searchConsoleId"
                  value={formData.searchConsoleId}
                  onChange={handleChange}
                  placeholder="Verification code from Google Search Console"
                  className="form-input w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Content of the <code>google-site-verification</code> meta tag.
                </p>
              </div>
            ) : (
              <p className="text-slate-900 dark:text-slate-100 font-semibold">
                {formData.searchConsoleId || "Not configured"}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end mt-4">
              <button onClick={handleCancel} className="btn-sm bg-rose-500 hover:bg-rose-600 text-white">
                Cancel
              </button>
              <button onClick={handleSave} className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3">
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 