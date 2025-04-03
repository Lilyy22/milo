const WebsiteIcon = ({ className }: { className?: string }) => {
	return (
		<svg className="m-0 h-6 w-6 fill-current dark:hover:text-blue-500 hover:scale-105 transition-all duration-100" viewBox="0 0 24 24">
			<path d="M19 4h-4V2h-6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V6h14v14zM7 9h10v2H7zm0 4h5v2H7z" />
		</svg>
	);
}

export default WebsiteIcon;