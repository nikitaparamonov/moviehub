import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMediaVideosPage, MediaVideosPageData } from '../api/tmdb'
import { getMediaTabsForPanel, normalizeTabName } from '../utils/getMediaTabsForPanel'
import VideoCard from '../components/media-page/VideoCard'
import MiniHeader from '../components/MiniHeader'
import MediaPanel from '../components/media-page/MediaPanel'
import '../components/css/media-page/MediaPage.css'
import { useDominantColor } from '../components/hooks/useDominantColor'

type RouteParams = {
	mediaType: 'movie' | 'tv'
	mediaId: string
}

const MediaPage = () => {
	const { mediaType, mediaId } = useParams<RouteParams>()

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [data, setData] = useState<MediaVideosPageData>()
	const [activeType, setActiveType] = useState<string>('Trailers')

	const link = `/${mediaType}/${mediaId}`
	const dominant = useDominantColor(
		data?.details.backdrop_path ? `https://image.tmdb.org/t/p/w780${data.details.backdrop_path}` : '',
	)

	useEffect(() => {
		if (!mediaType || !mediaId) return

		setLoading(true)
		setError(null)

		fetchMediaVideosPage(mediaType, Number(mediaId))
			.then(setData)
			.catch(() => setError('Failed to load media'))
			.finally(() => setLoading(false))
	}, [mediaType, mediaId])

	if (loading) {
		return <div>Loading videos…</div>
	}

	if (error) {
		return <div>{error}</div>
	}

	if (!mediaType || !mediaId || !data) return null

	const videoTabs = getMediaTabsForPanel(data.videos, mediaType, Number(mediaId), 'videos', 'Other')

	return (
		<div className="media-page">
			<MiniHeader md={data.details} link={link} />

			<div className="media-page-content center">
				<div className="media-page-content-wrapper flex-row">
					<MediaPanel
						title="Videos"
						items={videoTabs}
						activeType={activeType}
						dominantColor={dominant}
						onSelect={(type) => setActiveType(type)}
					/>

					<section className="video-list flex-column gap-30">
						{data.videos
							.filter((v) => v.type === normalizeTabName(activeType))
							.map((v) => (
								<VideoCard key={v.key} video={v} />
							))}
					</section>
				</div>
			</div>
		</div>
	)
}

export default MediaPage
