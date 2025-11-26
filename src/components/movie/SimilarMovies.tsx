import React from 'react'
import type { MovieSummary } from '../../api/tmdb'
import { Link } from 'react-router-dom'

interface SimilarMoviesProps {
	movies: MovieSummary[]
}

const SimilarMovies: React.FC<SimilarMoviesProps> = ({ movies }) => {
	return (
		<section className="similar-movies">
			<h3>Similar Movies</h3>
			<div className="similar-grid">
				{movies.map((m) => (
					<Link to={`/movie/${m.id}`} key={m.id} className="similar-card">
						{m.poster_path && <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={m.title} />}
						<p>{m.title}</p>
					</Link>
				))}
			</div>
		</section>
	)
}

export default SimilarMovies
