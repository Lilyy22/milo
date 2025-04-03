import { UpdateWebsiteDataType } from "@/schemas/update-website"
import { BasicSettings } from "../../components/basic-settings"
import { SelectPages } from "../../components/select-pages"
import { SelectTemplate } from "../../components/select-template"
import { SocialLinks } from "../../components/social-links"
import { AnalyticsSettings } from "../../components/analytics-settings"
import ModalBlank from "@/components/modal-blank"
import { useState } from "react"

type FirstStepProps = {
	formData: UpdateWebsiteDataType
	setFormData: React.Dispatch<React.SetStateAction<UpdateWebsiteDataType>>
	setCurrentStep: (step: number) => void
}

export const FirstStep = ({ formData, setFormData, setCurrentStep }: FirstStepProps) => {
	const [dangerModalOpen, setDangerModalOpen] = useState(false)

	const handleDataUpdateByKey = (key: keyof UpdateWebsiteDataType, value: any) => {
		setFormData(prev => ({ ...prev, [key]: value }))
	}

	const handleDataUpdate = (data: Partial<UpdateWebsiteDataType>) => setFormData(prev => ({ ...prev, ...data }))

	return (
		<div className="mb-8">
			<div className="mb-4 flex items-center">
				<div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-3">
					1
				</div>
				<h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
					Website Settings
				</h2>
			</div>
			<div className="space-y-6">
				<BasicSettings data={formData} handleDataUpdate={handleDataUpdate} />
				<SelectPages pages={formData.pages} handleDataUpdateByKey={handleDataUpdateByKey} />
				<SelectTemplate template={formData.template} handleDataUpdateByKey={handleDataUpdateByKey} />
				<SocialLinks socialLinks={formData.socialLinks} handleDataUpdateByKey={handleDataUpdateByKey} />
				<AnalyticsSettings data={formData} handleDataUpdate={handleDataUpdate} />
			</div>

			<button onClick={(e) => {
				e.preventDefault()
				setDangerModalOpen(true)
			}}>Open Modal</button>
			<ModalBlank isOpen={dangerModalOpen} setIsOpen={setDangerModalOpen}>
				hehehe
			</ModalBlank>
		</div>
	)
} 