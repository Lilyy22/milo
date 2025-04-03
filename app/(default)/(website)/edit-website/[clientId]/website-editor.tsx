"use client"

import { useState } from 'react'
import { WebsiteData, ClientData } from '@/app/types'
import { FirstStep } from "./first-step";
import { SecondStep } from "./second-step";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { getDefaultUpdateWebsiteData } from "@/constants/website";
import { UpdateWebsiteDataType } from "@/schemas/update-website";
import { toast } from "sonner";
import { generateWebsiteContent, updateWebsite } from "@/app/(default)/(website)/actions/website";

type WebsiteEditorProps = {
	website: WebsiteData;
	clientData: ClientData;
}

const getGeneratedContent = (website: WebsiteData) => {
	return {
		home: website.homePageContent || '',
		about: website.aboutPageContent || '',
		blog: website.blogPageContent || '',
		news: website.newsPageContent || '',
		contact: website.contactPageContent || ''
	}
}

export const WebsiteEditor = ({ website, clientData }: WebsiteEditorProps) => {
	const router = useRouter();
	const [generatedContent, setGeneratedContent] = useState<Record<string, any>>(() => getGeneratedContent(website))
	const [formData, setFormData] = useState<UpdateWebsiteDataType>(() => getDefaultUpdateWebsiteData(website))

	const [currentStep, setCurrentStep] = useState<number>(1)
	const [isGenerating, setIsGenerating] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const handleGenerateContent = async () => {
		const { pages } = formData;
		if (pages.length === 0) return toast.error('Please select at least one page to generate content for');

		setIsGenerating(true);

		return toast.promise(
			generateWebsiteContent(clientData.id, pages)
				.then(data => {
					setGeneratedContent(prev => ({ ...prev, ...data }));
					setCurrentStep(2);
					return data;
				}),
			{
				loading: 'Generating website content...',
				success: 'Content successfully generated!',
				error: (error) => `${error instanceof Error ? error.message : 'Failed to generate content'}`,
				finally: () => setIsGenerating(false)
			}
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);

		const websiteData = {
			...formData,
			...(generatedContent.home && { homePageContent: generatedContent.home }),
			...(generatedContent.about && { aboutPageContent: generatedContent.about }),
			...(generatedContent.blog && { blogPageContent: generatedContent.blog }),
			...(generatedContent.news && { newsPageContent: generatedContent.news }),
			...(generatedContent.contact && { contactPageContent: generatedContent.contact }),
		};

		return toast.promise(
			updateWebsite(clientData.id, websiteData).then(() => router.push('/projects')),
			{
				loading: 'Saving website changes...',
				success: 'Website updated successfully!',
				error: (error) => {
					setIsSaving(false);
					return `${error instanceof Error ? error.message : 'Failed to update website'}`
				}
			}
		);
	}

	if (isGenerating || isSaving) return <Spinner />

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			{currentStep === 1 && (
				<div>
					<FirstStep
						formData={formData}
						setFormData={setFormData}
						setCurrentStep={setCurrentStep}
					/>
					<div className="mt-6 flex justify-between">
						<button
							type="button"
							onClick={() => router.push('/projects')}
							className="btn bg-slate-500 hover:bg-slate-600 text-white"
						>
							Cancel
						</button>
						{
							<button
								type="button"
								onClick={() => generatedContent.home ? setCurrentStep(2) : handleGenerateContent()}
								className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
							>
								{generatedContent.home ? 'Next Step' : 'Generate Website Content with AI'}
							</button>
						}
					</div>
				</div>
			)}
			{currentStep === 2 && (
				<SecondStep
					formData={formData}
					generatedContent={generatedContent}
					setGeneratedContent={setGeneratedContent}
					setCurrentStep={setCurrentStep}
				/>
			)}
		</form>
	)
} 