import { Video } from '../../api/tmdb'
import { formatDate } from '../../utils/date'
import '../css/media-page/VideoCard.css'
import { ReactComponent as YouTubeIcon } from '../icons/youtube.svg'

type VideoCardProps = {
	video: Video
}

const VideoCard = ({ video }: VideoCardProps) => {
	if (video.site !== 'YouTube') return null

	const thumbnail = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`
	const videoUrl = `https://www.youtube.com/watch?v=${video.key}`

	return (
		<div className="video-card">
			<div className="vc-image-wrapper">
				<a href={videoUrl} target="_blank" rel="noopener noreferrer" className="vc-image-link">
					<img src={thumbnail} alt={video.name} className="vc-image" />
				</a>
			</div>
			<div className="vc-info flex-column">
				<div className="vc-info-header">
					<h2 className="vc-info-title">{video.name}</h2>
					<h3 className="vc-info-subtitle">
						<span>{video.type}</span>
						<span>{formatDate(video.published_at)}</span>
					</h3>
				</div>
				<div className="vc-info-footer">
					<YouTubeIcon className='vc-info-youtube'></YouTubeIcon>
				</div>
			</div>
		</div>
	)
}

export default VideoCard
