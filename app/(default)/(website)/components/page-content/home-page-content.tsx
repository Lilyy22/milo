import React from 'react';
import { EditableTextField, EditableStringArray } from '../editable-fields';

type HomePageContentProps = {
	content: any;
	onChange: (content: any) => void;
};

export const HomePageContent = ({
	content,
	onChange
}: HomePageContentProps) => {
	const updateContent = (path: string, value: any) => {
		const updatedContent = { ...content };

		if (path.includes('.')) {
			const [parent, child] = path.split('.');
			updatedContent[parent] = { ...updatedContent[parent], [child]: value };
		} else {
			updatedContent[path] = value;
		}

		onChange(updatedContent);
	};

	return (
		<div>
			<EditableTextField
				label="Page Title"
				value={content.title || ''}
				onChange={(value) => updateContent('title', value)}
			/>

			<hr className="border-t border-black/90 dark:border-white/90 my-8" />

			<div className="space-y-6">
				<h4 className="font-medium text-xl text-slate-800 dark:text-slate-100">Main Block</h4>
				<div className="space-y-5">
					<EditableTextField
						label="Section Title"
						value={content.mainBlock?.title || ''}
						onChange={(value) => updateContent('mainBlock.title', value)}
					/>
					<EditableTextField
						label="Text"
						value={content.mainBlock?.text || ''}
						onChange={(value) => updateContent('mainBlock.text', value)}
						multiline
					/>
				</div>
			</div>

			<hr className="border-t border-black/90 dark:border-white/90 my-8" />

			<div className="space-y-6">
				<h4 className="font-medium text-xl text-slate-800 dark:text-slate-100">{content.keysBlock?.title || 'Key Features Block'}</h4>
				<div className="space-y-6">
					<EditableTextField
						label="Section Title"
						value={content.keysBlock?.title || ''}
						onChange={(value) => updateContent('keysBlock.title', value)}
					/>
					<EditableStringArray
						label="Items"
						items={content.keysBlock?.items || []}
						onChange={(items) => updateContent('keysBlock.items', items)}
					/>
					<EditableTextField
						label="Footer Text"
						value={content.keysBlock?.footer || ''}
						onChange={(value) => updateContent('keysBlock.footer', value)}
					/>
				</div>
			</div>

			<hr className="border-t border-black/90 dark:border-white/90 my-8" />

			<EditableTextField
				label="Page Footer"
				value={content.footer || ''}
				onChange={(value) => updateContent('footer', value)}
			/>
		</div>
	);
};

export const renderHomePageContent = (content: any) => {
	if (!content) return <p>No content generated yet</p>;

	return (
		<div className="space-y-12">
			{content.title && (
				<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{content.title}</h1>
			)}

			{content.mainBlock && (
				<div>
					<h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">{content.mainBlock.title}</h2>
					<div className="">
						{content.mainBlock.text.split('\n').map((line: string, idx: number) => (
							<p key={idx}>{line}</p>
						))}
					</div>
				</div>
			)}

			{content.keysBlock && (
				<div>
					<h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">{content.keysBlock.title}</h2>
					<ul className="grid grid-cols-3 gap-6 mt-10 mb-6">
						{content.keysBlock.items?.map((item: string, idx: number) => (
							<li className="p-[8px_8px_8px_16px] border-l-2 border-black/80 dark:border-white/80" key={idx}>{item}</li>
						))}
					</ul>
					{content.keysBlock.footer && <p>{content.keysBlock.footer}</p>}
				</div>
			)}

			{content.footer && (
				<h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{content.footer}</h1>
			)}
		</div>
	);
}; 