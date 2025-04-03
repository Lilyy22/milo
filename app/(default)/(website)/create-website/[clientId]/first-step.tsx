import { BasicSettings } from "../../components/basic-settings"
import { SelectPages } from "../../components/select-pages"
import { SelectTemplate } from "../../components/select-template"
import { SocialLinks } from "../../components/social-links"
import { CreateWebsiteDataType } from '@/schemas/create-website'
import { UpdateWebsiteDataType } from "@/schemas/update-website"

type FirstStepProps = {
	formData: CreateWebsiteDataType
	setFormData: React.Dispatch<React.SetStateAction<CreateWebsiteDataType>>
	setCurrentStep: (step: number) => void
}

export const FirstStep = ({ formData, setFormData, setCurrentStep }: FirstStepProps) => {

	const handleDataUpdateByKey = (key: keyof CreateWebsiteDataType | keyof UpdateWebsiteDataType, value: any) => {
		setFormData(prev => ({ ...prev, [key]: value }))
	}

	const handleDataUpdate = (data: Partial<CreateWebsiteDataType>) => setFormData(prev => ({ ...prev, ...data }))

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
			</div>
		</div>
	)
}
