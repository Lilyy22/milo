"use client"

import { useState } from 'react'
import { ClientData } from '@/app/types'
import { FirstStep } from "./first-step";
import { SecondStep } from "./second-step";
import { getDefaultCreateWebsiteData } from "@/constants/website";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { CreateWebsiteDataType } from '@/schemas/create-website';
import { toast } from 'sonner';
import { generateWebsiteContent, createWebsite } from "@/app/(default)/(website)/actions/website";

type WebsiteGeneratorProps = {
	clientData: ClientData;
}


export const WebsiteGenerator = ({ clientData }: WebsiteGeneratorProps) => {
	const router = useRouter();
	const [generatedContent, setGeneratedContent] = useState<Record<string, any>>({})
	const [formData, setFormData] = useState<CreateWebsiteDataType>(() => getDefaultCreateWebsiteData(clientData))

	const [currentStep, setCurrentStep] = useState<number>(1)
	const [isGenerating, setIsGenerating] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const isContentGenerated = Object.keys(generatedContent).length > 0

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
			createWebsite(clientData.id, websiteData).then(() => router.push('/projects')),
			{
				loading: 'Creating your website...',
				success: 'Website created successfully!',
				error: (error) => {
					setIsSaving(false);
					return `${error instanceof Error ? error.message : 'Failed to create website'}`
				},
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
					<div className="mt-6 flex justify-end">
						{
							!isContentGenerated ? (
								<button
									type="button"
									onClick={handleGenerateContent}
									disabled={isGenerating}
									className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
								>
									Generate Website Content with AI
								</button>
							) : (
								<button
									type="button"
									disabled={isGenerating || !isContentGenerated}
									onClick={() => setCurrentStep(2)}
									className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
								>
									Next Step
								</button>
							)
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