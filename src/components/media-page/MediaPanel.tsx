import React from 'react'
import '../css/media-page/Sidepanel.css'

// Represents a single tab/item in the MediaPanel
export interface MediaPanelItem {
	type: string // Name of the tab, e.g., "Trailers", "Teasers"
	count: number // Number of items in this tab
	href: string // Link to the full page for this tab
}

interface MediaPanelProps {
	title: string // Panel title, e.g., "Videos"
	items: MediaPanelItem[]
	activeType?: string
	dominantColor: string
	onSelect?: (type: string) => void
}

const MediaPanel: React.FC<MediaPanelProps> = ({ title, items, activeType, dominantColor, onSelect }) => {
	return (
		<section
			className="sidepanel"
			style={
				{
					'--dominant-color': dominantColor,
				} as React.CSSProperties
			}
		>
			{/* Panel title */}
			<h3 className="sidepanel-title">{title}</h3>

			{/* List of tabs/items */}
			<ul className="sidepanel-menu flex-list flex-column">
				{items.map((item) => (
					<li
						key={item.type}
						className={`sidepanel-menu-item ${activeType === item.type ? 'selected' : ''}`}
						onClick={(e) => {
							e.preventDefault() // prevent full page reload
							onSelect?.(item.type)
						}}
					>
						<a href={item.href}>{item.type}</a>
						<span>{item.count}</span>
					</li>
				))}
			</ul>
		</section>
	)
}

export default MediaPanel
