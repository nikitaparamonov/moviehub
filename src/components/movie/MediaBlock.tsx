import React, { useMemo } from 'react'
import type { MovieMedia } from '../../api/tmdb'
import VideoCard from './VideoCard'
import Empty from '../Empty'

interface MediaBlockProps {
	media: MovieMedia | null
}

type MediaTab = 'videos' | 'backdrops' | 'posters'

const MediaBlock: React.FC<MediaBlockProps> = ({ media }) => {
	const TMDB_IMG = 'https://image.tmdb.org/t/p'
	const [activeTab, setActiveTab] = React.useState<MediaTab>('videos')
	// Tabs configuration: controls tab labels and item counts
	const tabs: { key: MediaTab; label: string; count: number }[] = [
		{ key: 'videos', label: 'Videos', count: media?.videos?.length ?? 0 },
		{ key: 'backdrops', label: 'Backdrops', count: media?.backdrops?.length ?? 0 },
		{ key: 'posters', label: 'Posters', count: media?.posters?.length ?? 0 },
	]

	// Cache first N items to avoid re-slicing on every render
	const firstVideos = useMemo(() => media?.videos?.slice(0, 6) ?? [], [media?.videos])
	const firstBackdrops = useMemo(() => media?.backdrops?.slice(0, 6) ?? [], [media?.backdrops])
	const firstPosters = useMemo(() => media?.posters?.slice(0, 6) ?? [], [media?.posters])

	// Renderer map: avoids large switch/if blocks and removes duplication
	const renderers = {
		videos: () =>
			firstVideos.length === 0 ? (
				<Empty text="No videos" />
			) : (
				firstVideos.map((v) => <VideoCard key={v.key} video={v} />)
			),

		backdrops: () =>
			firstBackdrops.length === 0 ? (
				<Empty text="No backdrops" />
			) : (
				firstBackdrops.map((b) => <img key={b.file_path} src={`${TMDB_IMG}/w400${b.file_path}`} alt="Backdrop" className='media-backdrop-image' loading="lazy" decoding="async" />)
			),

		posters: () =>
			firstPosters.length === 0 ? (
				<Empty text="No posters" />
			) : (
				firstPosters.map((p) => <img key={p.file_path} src={`${TMDB_IMG}/w300${p.file_path}`} alt="Poster" className='media-poster-image' loading="lazy" decoding="async" />)
			),
	}

	return (
		<section className="flex-column">
			<div className="content-block media-block-menu">
				<h3>Media</h3>
				<ul role="tablist" className="media-menu-list">
					{tabs.map((t) => (
						<li key={t.key}>
							<button
								role="tab"
								aria-selected={activeTab === t.key}
								onClick={() => setActiveTab(t.key)}
								className={activeTab === t.key ? 'is-active' : ''}
							>
								<strong>{t.label}</strong> {t.count}
							</button>
						</li>
					))}
				</ul>
			</div>
			<div className="horizontal-scroll-container">
				{/* Render selected tab content dynamically */}
				{renderers[activeTab]()}
			</div>
		</section>
	)
}

export default MediaBlock
