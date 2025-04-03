import { useState } from 'react'
import { Card } from './card'
import { CreateWebsiteDataType } from '@/schemas/create-website'
import { UpdateWebsiteDataType } from '@/schemas/update-website'

type BasicSettingsProps = {
  data: CreateWebsiteDataType | UpdateWebsiteDataType
  handleDataUpdate: (data: Partial<CreateWebsiteDataType | UpdateWebsiteDataType>) => void
}

export const BasicSettings = ({ data, handleDataUpdate }: BasicSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    siteName: data.siteName,
    description: data.description
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    setFormData({ siteName: data.siteName, description: data.description })
    setIsEditing(false)
  }

  const handleSave = () => {
    handleDataUpdate({
      siteName: formData.siteName,
      description: formData.description
    })
    setIsEditing(false)
  }

  return (
    <Card title="Basic Site Settings">
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
              Website Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                className="form-input w-full"
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100 font-semibold">{formData.siteName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Website Description
            </label>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea w-full"
                rows={3}
              />
            ) : (
              <p className="text-slate-900 dark:text-slate-100 font-semibold">{formData.description}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end mt-4">
              <button onClick={handleCancel} className="btn-sm bg-rose-500 hover:bg-rose-600 text-white">
                Cancel
              </button>
              <button onClick={handleSave} className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 