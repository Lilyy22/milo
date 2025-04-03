import { useState } from 'react'
import { Card } from './card'
import { CreateWebsiteDataType } from '@/schemas/create-website'
import { UpdateWebsiteDataType } from '@/schemas/update-website'

type SocialLinksProps = {
	socialLinks: CreateWebsiteDataType['socialLinks'] | UpdateWebsiteDataType['socialLinks']
	handleDataUpdateByKey: (key: keyof CreateWebsiteDataType | keyof UpdateWebsiteDataType, value: any) => void
}

export const SocialLinks = ({ socialLinks, handleDataUpdateByKey }: SocialLinksProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState(socialLinks)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleCancel = () => {
		setFormData(socialLinks)
		setIsEditing(false)
	}

	const handleSave = () => {
		handleDataUpdateByKey('socialLinks', formData)
		setIsEditing(false)
	}

	const isFormValid = formData.x.trim() && formData.facebook.trim() && formData.linkedin.trim()


	return (
		<Card title="Social Media Links">
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
							Twitter / X <span className="text-rose-500">*</span>
						</label>
						{isEditing ? (
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<svg className="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
										<path d="M13.6823 10.6178L20.2391 3H18.6854L13.0175 9.61254L8.46467 3H3L9.86453 12.764L3 20.7787H4.55867L10.534 13.7692L15.3553 20.7787H20.82L13.6819 10.6178H13.6823ZM11.3058 12.8666L10.4323 11.7262L4.97138 4.2856H7.50329L11.9908 10.3936L12.8643 11.534L18.6851 19.4144H16.1532L11.3058 12.8669V12.8666Z" />
									</svg>
								</div>
								<input
									type="text"
									name="x"
									value={formData.x}
									onChange={handleChange}
									placeholder="https://x.com/username"
									className="form-input w-full pl-10"
									required
								/>
							</div>
						) : (
							<p className="text-slate-900 dark:text-slate-100 font-semibold">
								{formData.x ? formData.x : <span className="text-slate-400 italic">Not set</span>}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
							Facebook <span className="text-rose-500">*</span>
						</label>
						{isEditing ? (
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<svg className="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
										<path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
									</svg>
								</div>
								<input
									type="text"
									name="facebook"
									value={formData.facebook}
									onChange={handleChange}
									placeholder="https://facebook.com/pagename"
									className="form-input w-full pl-10"
									required
								/>
							</div>
						) : (
							<p className="text-slate-900 dark:text-slate-100 font-semibold">
								{formData.facebook ? formData.facebook : <span className="text-slate-400 italic">Not set</span>}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
							LinkedIn <span className="text-rose-500">*</span>
						</label>
						{isEditing ? (
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<svg className="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 0 1-1.548-1.549 1.548 1.548 0 1 1 1.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z" />
									</svg>
								</div>
								<input
									type="text"
									name="linkedin"
									value={formData.linkedin}
									onChange={handleChange}
									placeholder="https://linkedin.com/company/name"
									className="form-input w-full pl-10"
									required
								/>
							</div>
						) : (
							<p className="text-slate-900 dark:text-slate-100 font-semibold">
								{formData.linkedin ? formData.linkedin : <span className="text-slate-400 italic">Not set</span>}
							</p>
						)}
					</div>

					{isEditing && (
						<div className="flex justify-end mt-4">
							<button onClick={handleCancel} className="btn-sm bg-rose-500 hover:bg-rose-600 text-white">
								Cancel
							</button>
							<button
								onClick={handleSave}
								className={`btn ml-3 ${isFormValid ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-indigo-300 cursor-not-allowed text-white'}`}
								disabled={!isFormValid}
							>
								Save Changes
							</button>
						</div>
					)}
				</div>
			</div>
		</Card>
	)
} 