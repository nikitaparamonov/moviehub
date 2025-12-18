import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	fetchMediaBackdropsPage,
	fetchMediaPostersPage,
	fetchMediaVideosPage,
	MediaVideosBackdropsData,
	MediaVideosPageData,
	MediaVideosPostersData
} from '../api/tmdb'
import { getMediaTabsForPanel, normalizeTabName } from '../utils/getMediaTabsForPanel'
import VideoCard from '../components/media-page/VideoCard'
import MiniHeader from '../components/MiniHeader'
import MediaPanel, { MediaPanelItem } from '../components/media-page/MediaPanel'
import ImageCard from '../components/media-page/ImageCard'
import '../components/css/media-page/MediaPage.css'
import { useDominantColor } from '../components/hooks/useDominantColor'

/** URL params from React Router */
type RouteParams = {
	mediaType: 'movie' | 'tv'
	mediaId: string
}

/** Media page variant controlled by routing */
type MediaPageProps = {
	contentType: 'videos' | 'images/backdrops' | 'images/posters'
}

/** API response type per content type */
type MediaDataMap = {
	videos: MediaVideosPageData
	'images/backdrops': MediaVideosBackdropsData
	'images/posters': MediaVideosPostersData
}

/** Contract for panel configuration per content type */
type MediaConfig<K extends keyof MediaDataMap> = {
	title: string
	items: (data: MediaDataMap[K]) => MediaPanelItem[]
	content: (data: MediaDataMap[K]) => React.ReactNode
}

/** Maps content type to correct fetch function */
const FETCHERS = {
	videos: fetchMediaVideosPage,
	'images/backdrops': fetchMediaBackdropsPage,
	'images/posters': fetchMediaPostersPage
} as const

const MediaPage = ({ contentType }: MediaPageProps) => {
	const { mediaType, mediaId } = useParams<RouteParams>()

	// Async state handling
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Holds fetched data for the active content type
	const [data, setData] = useState<MediaDataMap[typeof contentType] | null>(null)

	// Active tab (video type or image language)
	const [activeType, setActiveType] = useState<string>('')

	// Link back to media main page
	const link = mediaType && mediaId ? `/${mediaType}/${mediaId}` : '/'

	// Extract dominant color from backdrop for panel styling
	const dominant = useDominantColor(
		data?.details.backdrop_path
			? `https://image.tmdb.org/t/p/w780${data.details.backdrop_path}`
			: ''
	)

	/** Fetch correct media data when route or contentType changes */
	useEffect(() => {
		if (!mediaType || !mediaId) return

		const load = async () => {
			try {
				setLoading(true)
				setError(null)

				const fetchFn = FETCHERS[contentType]
				const result = await fetchFn(mediaType, Number(mediaId))
				setData(result)
			} catch {
				setError('Failed to load media')
			} finally {
				setLoading(false)
			}
		}

		load()
	}, [mediaType, mediaId, contentType])

	/** Reset default active tab when content type changes */
	useEffect(() => {
		setActiveType(contentType === 'videos' ? 'Trailers' : 'English')
	}, [contentType])

	// Early returns for async states
	if (loading) return <div>Loading…</div>
	if (error) return <div>{error}</div>
	if (!mediaType || !mediaId || !data) return null

	/** Configuration for each content type */
	const config: { [K in keyof MediaDataMap]: MediaConfig<K> } = {
		videos: {
			title: 'Videos',
			items: (data) =>
				getMediaTabsForPanel(data.videos, mediaType!, Number(mediaId), 'videos', 'Other'),
			content: (data) => (
				<section className="video-list flex-column gap-30">
					{data.videos
						.filter(v => v.type === normalizeTabName(activeType))
						.map(v => <VideoCard key={v.key} video={v} />)}
				</section>
			)
		},

		'images/backdrops': {
			title: 'Backdrops',
			items: (data) =>
				getMediaTabsForPanel(
					data.backdrops,
					mediaType!,
					Number(mediaId),
					'images/backdrops',
					'Other'
				),
			content: (data) => (
				<section className="backdrop-list flex flex-wrap gap-10">
					{data.backdrops.map(b => (
						<ImageCard key={b.file_path} image={b} />
					))}
				</section>
			)
		},

		'images/posters': {
			title: 'Posters',
			items: (data) =>
				getMediaTabsForPanel(
					data.posters,
					mediaType!,
					Number(mediaId),
					'images/posters',
					'Other'
				),
			content: (data) => (
				<section className="poster-list flex flex-wrap gap-10">
					{data.posters.map(b => (
						<ImageCard key={b.file_path} image={b} />
					))}
				</section>
			)
		}
	}

	// Values resolved based on current contentType
	let panelTitle = ''
	let panelItems: MediaPanelItem[] = []
	let renderedContent: React.ReactNode = null

	if (contentType === 'videos') {
		const cfg = config.videos
		panelTitle = cfg.title
		panelItems = cfg.items(data as MediaVideosPageData)
		renderedContent = cfg.content(data as MediaVideosPageData)
	}

	if (contentType === 'images/backdrops') {
		const cfg = config['images/backdrops']
		panelTitle = cfg.title
		panelItems = cfg.items(data as MediaVideosBackdropsData)
		renderedContent = cfg.content(data as MediaVideosBackdropsData)
	}

	if (contentType === 'images/posters') {
		const cfg = config['images/posters']
		panelTitle = cfg.title
		panelItems = cfg.items(data as MediaVideosPostersData)
		renderedContent = cfg.content(data as MediaVideosPostersData)
	}

	/** Layout shared by all media types */
	return (
		<div className="media-page">
			<MiniHeader md={data.details} link={link} />

			<div className="media-page-content center">
				<div className="media-page-content-wrapper flex-row">
					<MediaPanel
						title={panelTitle}
						items={panelItems}
						activeType={activeType}
						dominantColor={dominant}
						onSelect={setActiveType}
					/>

					{renderedContent}
				</div>
			</div>
		</div>
	)
}

export default MediaPage
