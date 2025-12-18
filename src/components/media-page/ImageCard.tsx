import { Image } from '../../api/tmdb'
import '../css/media-page/ImageCard.css'

type ImageCardProps = {
	image: Image
}

const BASE_URL = 'https://media.themoviedb.org/t/p/'
const PREVIEW_SIZE = 'w500_and_h282_face'
const ORIGINAL_SIZE = 'original'

const ImageCard = ({ image }: ImageCardProps) => {
	const previewSrc = `${BASE_URL}${PREVIEW_SIZE}${image.file_path}`
	const originalSrc = `${BASE_URL}${ORIGINAL_SIZE}${image.file_path}`

	return (
		<div className="image-card-wrapper">
			<img
				src={previewSrc}
				alt={`Media backdrop/poster (${image.width}×${image.height})`}
				className="image-card-img"
				loading="lazy"
			/>

			<div className="info-wrapper">
				<h3 className="info-title">
					<span>Info</span>
				</h3>

				<div className="info-content flex-column gap-10">
					<div>
						<h4 className="info-subtitle">Added By</h4>
						<p className="info-subtitle-content">
							<a href="/" aria-disabled>
								name 
							</a>
						</p>
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
								Original size
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ImageCard
