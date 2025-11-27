import React from 'react'
import type { MovieCrewCredit, MovieDetails } from '../../api/tmdb'
import { formatRuntime, getYear } from '../../utils/date'
import { useDominantColor } from '../hooks/useDominantColor'
import '../css/MoviePage.css'

interface Props {
	movie: MovieDetails
	crew: MovieCrewCredit[]
	certification?: string
	releaseDate?: string
}

const MovieInfo: React.FC<Props> = ({ movie, crew, certification, releaseDate }) => {
	const importantJobs = ['Director', 'Writer', 'Characters', 'Novel', 'Screenplay', 'Story']
	const dominant = useDominantColor(
		movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : undefined,
	)

	const [r, g, b] = dominant || [20, 20, 20]
	const backdropUrl = movie.backdrop_path ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` : 'none'

	// Group crew members by id and merge all important jobs
	const groupedCrew = Object.values(
		crew.reduce<Record<number, { name: string; jobs: string[] }>>((acc, person) => {
			if (!person.job || !importantJobs.includes(person.job)) return acc

			if (!acc[person.id]) {
				acc[person.id] = { name: person.name, jobs: [] }
			}

			// Avoid duplicates and keep only important jobs
			if (!acc[person.id].jobs.includes(person.job)) {
				acc[person.id].jobs.push(person.job)
			}
			return acc
		}, {}),
	)

	// Sort jobs for each person according to importantJobs order
	groupedCrew.forEach((person) => {
		person.jobs.sort((a, b) => importantJobs.indexOf(a) - importantJobs.indexOf(b))
	})

	// Sort crew array itself alphabetically by first job, then by name
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
			<div className="movie-info">
				{movie.poster_path && (
					<img
						src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
						alt={movie.title}
						className="movie-poster"
						loading="lazy"
					/>
				)}

				<div className="movie-details">
					<div className="movie-title-block">
						<h2 className="movie-title">
							{movie.title} <span className="movie-year">({getYear(movie.release_date)})</span>
						</h2>
						<div className="movie-facts">
							<span className="facts-certification">{certification}</span>
							<span className="facts-release-date">{releaseDate}</span>
							<span className="facts-genres">{movie.genres.map((g) => g.name).join(', ')}</span>
							<span className="facts-runtime">{formatRuntime(movie.runtime)}</span>
						</div>
					</div>

					<div className="movie-header-info">
						{movie.tagline && <span className="movie-tagline">{movie.tagline}</span>}
						<h3 className="overview-title">Overview</h3>
						<div>{movie.overview && <p className="movie-overview">{movie.overview}</p>}</div>
						<ol className="movie-crew">
							{groupedCrew.map((person) => (
								<li key={person.name} className="crew-person">
									<p className='crew-person-name'>{person.name}</p>
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

export default MovieInfo
