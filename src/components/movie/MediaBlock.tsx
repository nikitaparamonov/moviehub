import React, { useId, useMemo } from 'react'
import type { MovieMedia } from '../../api/tmdb'
import VideoCard from './VideoCard'
import Empty from '../Empty'
import { ImageWithFallback } from '../ui/ImageWithFallback'
import MediaTabs from './MediaTabs'
import "../css/movie-page/MediaBlock.css"

interface MediaBlockProps {
	media: MovieMedia | null
	mediaType: MediaType
	mediaId: number
}

type MediaType = 'movie' | 'tv'
export type MediaTab = 'videos' | 'backdrops' | 'posters'

const MediaBlock: React.FC<MediaBlockProps> = ({ media, mediaType, mediaId }) => {
	const TMDB_IMG = 'https://image.tmdb.org/t/p'
	const [activeTab, setActiveTab] = React.useState<MediaTab>('videos')
	const baseId = useId()

	const getViewAllHref = (mediaType: MediaType, mediaId: number, target: MediaTab) => {
		switch (target) {
			case 'videos':
				return `/${mediaType}/${mediaId}/videos`

			case 'backdrops':
				return `/${mediaType}/${mediaId}/images/backdrops`

			case 'posters':
				return `/${mediaType}/${mediaId}/images/posters`

			default:
				return '#'
		}
	}

	// Generate unique IDs for ARIA accessibility
	const tabs = useMemo(
		() => [
			{
				key: 'videos' as const,
				label: 'Videos',
				count: media?.videos?.length ?? 0,
				tabId: `${baseId}-tab-videos`,
				panelId: `${baseId}-panel-videos`,
			},
			{
				key: 'backdrops' as const,
				label: 'Backdrops',
				count: media?.backdrops?.length ?? 0,
				tabId: `${baseId}-tab-backdrops`,
				panelId: `${baseId}-panel-backdrops`,
			},
			{
				key: 'posters' as const,
				label: 'Posters',
				count: media?.posters?.length ?? 0,
				tabId: `${baseId}-tab-posters`,
				panelId: `${baseId}-panel-posters`,
			},
		],
		[media, baseId],
	)

	// Cache first 6 items to prevent re-slicing on every render
	const firstVideos = useMemo(() => media?.videos?.slice(0, 6) ?? [], [media?.videos])
	const firstBackdrops = useMemo(() => media?.backdrops?.slice(0, 6) ?? [], [media?.backdrops])
	const firstPosters = useMemo(() => media?.posters?.slice(0, 6) ?? [], [media?.posters])

	// Find the currently active tab object for ARIA
	const currentTab = tabs.find((t) => t.key === activeTab)!

	// Helper for rendering lists
	const renderList = <T,>(items: T[], emptyText: string, renderItem: (item: T) => React.ReactNode) => {
		return items.length === 0 ? <Empty text={emptyText} /> : items.map(renderItem)
	}

	// Memoized renderers for each tab
	const renderers = useMemo(
		() => ({
			videos: () => renderList(firstVideos, 'No videos', (v) => <VideoCard key={v.key} video={v} />),

			backdrops: () =>
				renderList(firstBackdrops, 'No backdrops', (b) => (
					<ImageWithFallback
						key={b.file_path}
						src={`${TMDB_IMG}/w400${b.file_path}`}
						alt="Backdrop"
						className="media-backdrop-image"
						type="poster"
					/>
				)),

			posters: () =>
				renderList(firstPosters, 'No posters', (p) => (
					<ImageWithFallback
						key={p.file_path}
						src={`${TMDB_IMG}/w300${p.file_path}`}
						alt="Poster"
						className="media-poster-image"
						type="poster"
					/>
				)),
		}),
		[firstVideos, firstBackdrops, firstPosters, TMDB_IMG],
	)

	const viewAllHref = getViewAllHref(mediaType, mediaId, activeTab)

	return (
		<section className="flex-column" aria-labelledby="media-heading">
			<div className="content-block media-block-menu">
				<h3>Media</h3>
				<MediaTabs
					tabs={tabs}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					viewAllLabel={currentTab.label}
					viewAllHref={viewAllHref}
				/>
			</div>

			<div
				role="tabpanel"
				id={currentTab.panelId}
				className="horizontal-scroll-container"
				aria-labelledby={currentTab.tabId}
			>
				{renderers[activeTab]()}
			</div>
		</section>
	)
}

export default MediaBlock
