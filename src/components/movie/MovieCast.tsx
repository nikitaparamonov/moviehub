import React from 'react'
import type { MovieCastCredit } from '../../api/tmdb'
import { Link } from 'react-router-dom'

interface MovieCastProps {
	cast: MovieCastCredit[]
}

const MovieCast: React.FC<MovieCastProps> = ({ cast }) => {
	return (
		<section className="movie-cast">
			<h3>Cast</h3>
			<div className="cast-grid">
				{cast.map((c, i) => (
					<Link to={`/person/${c.id}`} key={`${c.id}-${i}`} className="cast-card">
						{c.profile_path && (
							<img src={`https://image.tmdb.org/t/p/w200${c.profile_path}`} alt={c.name} />
						)}
						<p className="cast-name">{c.name}</p>
						<p className="cast-role">{c.character}</p>
					</Link>
				))}
			</div>
		</section>
	)
}

export default MovieCast
