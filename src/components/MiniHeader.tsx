import { MovieDetails, TVDetails } from '../api/tmdb'
import { getYear } from '../utils/date'
import '../components/css/MiniHeader.css'
import { Link } from 'react-router-dom'
import { useDominantColor } from './hooks/useDominantColor'

interface MiniHeaderProps {
	md: MovieDetails | TVDetails
	link: string
}

const MiniHeader: React.FC<MiniHeaderProps> = ({ md, link }) => {
	const title = 'title' in md ? md.title : md.name

	function getMediaReleaseDate(media: MovieDetails | TVDetails): string | undefined {
		if ('release_date' in media) return media.release_date
		if ('first_air_date' in media) return media.first_air_date
		return undefined
	}

	const dominant = useDominantColor(md.backdrop_path ? `https://image.tmdb.org/t/p/w780${md.backdrop_path}` : '')

	return (
		<div
			className="mini-header center"
			style={
				{
					'--dominant-color': dominant,
				} as React.CSSProperties
			}
		>
			<div className="mini-header-wrapper flex-row">
				<img
					src={`https://media.themoviedb.org/t/p/w58_and_h87_face${md.backdrop_path}`}
					alt={title}
					className="mini-header-poster"
				/>
				<div className="flex-column">
					<h2 className="mini-header-title">
						{title} <span>({getYear(getMediaReleaseDate(md))})</span>
					</h2>
					<h3 className="mini-header-back">
						<Link to={link} className="mini-header-back-text">
							← Back to main
						</Link>
					</h3>
				</div>
			</div>
		</div>
	)
}

export default MiniHeader
