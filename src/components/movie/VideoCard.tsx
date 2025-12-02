import React from 'react'
import { Video } from '../../api/tmdb'

interface VideoCardProps {
	video: Video
}
const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
	const thumbnailUrl = video.site === 'YouTube' ? `https://i.ytimg.com/vi/${video.key}/hqdefault.jpg` : ''

	return (
		<div className="video-card">
			<div className="video-card-wrapper" style={{ backgroundImage: `url(${thumbnailUrl})` }}>
				<a
					className="video-card-link"
					href={`https://www.youtube.com/watch?v=${video.key}`}
					target="_blank"
					rel="noreferrer"
					data-site={video.site}
					data-id={video.key}
					data-title={video.name}
				>
					<div className="play-icon"></div>
				</a>
			</div>
		</div>
	)
}

export default React.memo(VideoCard)
