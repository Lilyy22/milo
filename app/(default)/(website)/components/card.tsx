interface CardProps {
	title?: string
	children: React.ReactNode
}

export const Card = ({ title, children }: CardProps) => {
	return (
		<div className="relative bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
			{title && (
				<h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
					{title}
				</h3>
			)}
			{children}
		</div>
	)
}
