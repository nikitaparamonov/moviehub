import React, { useRef } from 'react'
import type { MediaTab } from './MediaBlock'
import { Link } from 'react-router-dom';

interface MediaTabsProps {
	// Tabs configuration including ARIA ids for accessibility
	tabs: { key: MediaTab; label: string; count: number; tabId: string; panelId: string }[]
	// Currently active tab key
	activeTab: MediaTab
	// Callback when a tab is selected
	onTabChange: (tab: MediaTab) => void

	viewAllLabel: string
	viewAllHref: string
}

const MediaTabs: React.FC<MediaTabsProps> = ({ tabs, activeTab, onTabChange, viewAllLabel, viewAllHref }) => {
	// Refs for all tab buttons to manage keyboard navigation
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

	// Handle arrow/Home/End key navigation between tabs
	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		if (e.key === 'ArrowRight') tabRefs.current[(index + 1) % tabs.length]?.focus()
		if (e.key === 'ArrowLeft') tabRefs.current[(index - 1 + tabs.length) % tabs.length]?.focus()
		if (e.key === 'Home') tabRefs.current[0]?.focus()
		if (e.key === 'End') tabRefs.current[tabs.length - 1]?.focus()
	}

	return (
		<div className="media-tabs">
			<ul role="tablist" className="media-menu-list">
				{tabs.map((t, i) => (
					<li key={t.key}>
						<button
							// Assign ref for keyboard focus management
							ref={(el) => {
								tabRefs.current[i] = el
							}}
							role="tab"
							id={t.tabId}
							aria-selected={activeTab === t.key} // Accessibility: mark active tab
							aria-controls={t.panelId}
							tabIndex={activeTab === t.key ? 0 : -1} // Only active tab is focusable
							onClick={() => onTabChange(t.key)}
							onKeyDown={(e) => handleKeyDown(e, i)}
							className={activeTab === t.key ? 'is-active' : ''}
						>
							<strong>{t.label}</strong> {t.count}
						</button>
					</li>
				))}
			</ul>

			<Link to={viewAllHref} className="media-view-all">
				View All {viewAllLabel}
			</Link>
		</div>
	)
}

export default MediaTabs
