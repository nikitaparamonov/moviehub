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
}

interface MediaInfoProps {
	media: MediaBase
}

interface GroupedCrew {
	id: number
	name: string
	jobs: string[]
}

const MediaInfo: React.FC<MediaInfoProps> = ({ media }) => {
	const dominant = useDominantColor(
		media.backdrop_path ? `https://image.tmdb.org/t/p/w780${media.backdrop_path}` : undefined,
	)
	const [r, g, b] = dominant || [20, 20, 20]
	const backdropUrl = media.backdrop_path ? `url(https://image.tmdb.org/t/p/original${media.backdrop_path})` : 'none'

	const importantJobs = ['Director', 'Writer', 'Characters', 'Novel', 'Screenplay', 'Story']

	// Group crew members by ID and filter only important jobs
	const groupedCrew: GroupedCrew[] = Object.values(
		media.crew.reduce<Record<number, GroupedCrew>>((acc, person) => {
			console.log(acc)
			console.log(person)
			if (!person.job || !importantJobs.includes(person.job)) return acc

			if (!acc[person.id]) {
				acc[person.id] = { id: person.id, name: person.name, jobs: [] }
			}

			// Avoid duplicate jobs
			if (!acc[person.id].jobs.includes(person.job)) {
				acc[person.id].jobs.push(person.job)
			}
			return acc
		}, {}),
	)
	

	// Sort jobs by priority for each person
	groupedCrew.forEach((person) => {
		person.jobs.sort((a, b) => importantJobs.indexOf(a) - importantJobs.indexOf(b))
	})
	

	// Sort people by first job priority, then by name
	groupedCrew.sort((a, b) => {
		const jobCompare = importantJobs.indexOf(a.jobs[0]) - importantJobs.indexOf(b.jobs[0])
		if (jobCompare !== 0) return jobCompare
		return a.name.localeCompare(b.name)
	})

	

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
							{media.releaseDate && <span className="facts-release-date">{media.releaseDate}</span>}
							<span className="facts-genres">{media.genres.map((g) => g.name).join(', ')}</span>
							{media.runtime && <span className="facts-runtime">{formatRuntime(media.runtime)}</span>}
						</div>
					</div>

					<div className="movie-header-info">
						{media.tagline && <span className="movie-tagline">{media.tagline}</span>}
						<h3 className="overview-title">Overview</h3>
						{media.overview && <p className="movie-overview">{media.overview}</p>}
						<ol className="movie-header-crew flex">
							{groupedCrew.map((person) => (
								<li key={person.id} className="crew-person">
									<Link to={`/person/${person.id}`} className="crew-person-name">
										{person.name}
									</Link>
									<p className="crew-person-job">{person.jobs.join(', ')}</p>
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
