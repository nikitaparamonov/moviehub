import React from 'react'
import type { MovieCrewCredit } from '../../api/tmdb'
import { Link } from 'react-router-dom'

interface MovieCrewProps {
	crew: MovieCrewCredit[]
}

const MovieCrew: React.FC<MovieCrewProps> = ({ crew }) => {
	return (
		<section className="movie-crew">
			<h3>Crew</h3>
			<div className="crew-grid">
				{crew.map((c, i) => (
					<Link to={`/person/${c.id}`} key={`${c.id}-${i}`} className="crew-card">
						{c.profile_path && (
							<img src={`https://image.tmdb.org/t/p/w200${c.profile_path}`} alt={c.name} />
						)}
						<p className="crew-name">{c.name}</p>
						<p className="crew-job">{c.job}</p>
					</Link>
				))}
			</div>
		</section>
	)
}

export default MovieCrew
