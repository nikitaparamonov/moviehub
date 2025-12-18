import React from 'react'
import { Link } from 'react-router-dom'
import { useDominantColor } from '../hooks/useDominantColor'
import { formatRuntime, getYear } from '../../utils/date'
import { CrewCredit, Genre } from '../../api/tmdb'
import { ImageWithFallback } from '../ui/ImageWithFallback'
import "../css/movie-page/MovieHeader.css"

export interface MediaBase {
	id: number
	title: string
	overview?: string
	poster_path?: string | null
	backdrop_path?: string | null
	releaseDate?: string
	genres: Genre[]
	tagline?: string
	crew: CrewCredit[]
	runtime?: number
	certification?: string
	tvType?: string
	mediaType: 'movie' | 'tv'
}

interface MediaInfoProps {
	media: MediaBase
}

const MediaInfo: React.FC<MediaInfoProps> = ({ media }) => {
	const dominant = useDominantColor(
		media.backdrop_path ? `https://image.tmdb.org/t/p/w780${media.backdrop_path}` : '',
	)
	const backdropUrl = media.backdrop_path ? `url(https://image.tmdb.org/t/p/original${media.backdrop_path})` : 'none'

	return (
		<div
			className="movie-info-wrapper"
			style={
				{
					'--dominant-color': dominant,
					'--backdrop-url': backdropUrl,
				} as React.CSSProperties
			}
		>
			<div className="movie-info flex gap-30">
				<ImageWithFallback
					src={media.poster_path ? `https://image.tmdb.org/t/p/w400${media.poster_path}` : null}
					alt={media.title}
					className="movie-poster"
					type="poster"
				/>

				<div>
					<div className="movie-title-block">
						<h2 className="movie-title">
							{media.title} <span className="movie-year">({getYear(media.releaseDate)})</span>
						</h2>
						<div className="movie-facts flex">
							{media.certification && <span className="facts-certification">{media.certification}</span>}
							{media.mediaType === 'movie' && media.releaseDate && (
								<span className="facts-release-date">{media.releaseDate}</span>
							)}
							<span className="facts-genres">{media.genres.map((g) => g.name).join(', ')}</span>
							{media.runtime && <span className="facts-runtime">{formatRuntime(media.runtime)}</span>}
						</div>
					</div>

					<div className="movie-header-info">
						{media.tagline && <p className="movie-tagline">{media.tagline}</p>}
						<h3 className="overview-title">Overview</h3>
						<p className="movie-overview">{media.overview || 'No overview available.'}</p>
						<ol className="movie-header-crew flex">
							{media.crew.map((person) => (
								<li key={person.id} className="crew-person">
									<Link to={`/person/${person.id}`} className="crew-person-name">
										{person.name}
									</Link>
									<p className="crew-person-job">{person.jobs?.join(', ')}</p>
								</li>
							))}
						</ol>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MediaInfo
