import { Image } from '../../api/tmdb'
import '../css/media-page/ImageCard.css'

type ImageCardProps = {
	image: Image
	type: string
}

const BASE_URL = 'https://media.themoviedb.org/t/p/'
const PREVIEW_SIZE_BACKDROP = 'w500_and_h282_face'
const PREVIEW_SIZE_POSTER = 'w342'
const ORIGINAL_SIZE = 'original'

const ImageCard = ({ image, type }: ImageCardProps) => {
	let previewSrc = ''
	const originalSrc = `${BASE_URL}${ORIGINAL_SIZE}${image.file_path}`

	if (type === 'backdrop') {
		previewSrc = `${BASE_URL}${PREVIEW_SIZE_BACKDROP}${image.file_path}`
	} else if (type === 'poster') {
		previewSrc = `${BASE_URL}${PREVIEW_SIZE_POSTER}${image.file_path}`
	}

	return (
		<div className="image-card-wrapper">
			<a href={originalSrc} className="image-wrapper">
				<img
					src={previewSrc}
					alt={`Media backdrop/poster (${image.width}×${image.height})`}
					className="image-card-img"
					loading="lazy"
				/>
			</a>

			<div className="info-wrapper">
				<h3 className="info-title">
					<span>Info</span>
				</h3>

				<div className="info-content flex-column gap-10">
					<div>
						<h4 className="info-subtitle">Added By</h4>
						<p className="info-subtitle-content">Admin</p>
					</div>

					<div>
						<h4 className="info-subtitle">Size</h4>
						<p className="info-subtitle-content">
							<a
								href={originalSrc}
								target="_blank"
								rel="noopener noreferrer"
								title="View original image size"
							>
								{image.width}×{image.height}
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ImageCard
