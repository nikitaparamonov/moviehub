import React from 'react'
import { Link } from 'react-router-dom'
import { useDominantColor } from '../hooks/useDominantColor'
import { formatRuntime, getYear } from '../../utils/date'
import '../css/MoviePage.css'
import { CrewCredit, Genre } from '../../api/tmdb'

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
		media.backdrop_path ? `https://image.tmdb.org/t/p/w780${media.backdrop_path}` : undefined,
	)
	const [r, g, b] = dominant || [20, 20, 20]
	const backdropUrl = media.backdrop_path ? `url(https://image.tmdb.org/t/p/original${media.backdrop_path})` : 'none'

	return (
		<div
			className="movie-info-wrapper"
			style={
				{
					'--dominant-color': `rgb(${r},${g},${b})`,
					'--backdrop-url': backdropUrl,
				} as React.CSSProperties
			}
		>
			<div className="movie-info flex gap-30">
				{media.poster_path && (
					<img
						src={`https://image.tmdb.org/t/p/w400${media.poster_path}`}
						alt={media.title}
						className="movie-poster"
						loading="lazy"
					/>
				)}

				<div>
					<div className="movie-title-block">
						<h2 className="movie-title">
							{media.title} <span className="movie-year">({getYear(media.releaseDate)})</span>
						</h2>
						<div className="movie-facts flex">
							{media.certification && <span className="facts-certification">{media.certification}</span>}
							{media.mediaType === 'movie' && media.releaseDate && <span className="facts-release-date">{media.releaseDate}</span>}
							<span className="facts-genres">{media.genres.map((g) => g.name).join(', ')}</span>
							{media.runtime && <span className="facts-runtime">{formatRuntime(media.runtime)}</span>}
						</div>
					</div>

					<div className="movie-header-info">
						{media.tagline && <span className="movie-tagline">{media.tagline}</span>}
						<h3 className="overview-title">Overview</h3>
						{media.overview && <p className="movie-overview">{media.overview}</p>}
						<ol className="movie-header-crew flex">
							{media.crew
								.map((person) => (
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
