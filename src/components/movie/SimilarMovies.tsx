import React from 'react'
import type { MovieSummary } from '../../api/tmdb'
import { Link } from 'react-router-dom'
import { ReactComponent as NoImageIcon } from '../icons/NoImageIcon.svg'

interface SimilarMoviesProps {
	movies: MovieSummary[]
}

const SimilarMovies: React.FC<SimilarMoviesProps> = ({ movies }) => {
	return (
		<section className="content-block">
			<h3>Recommendations</h3>
			<div className="horizontal-scroll-container">
				{movies.map((m) => (
					<Link to={`/movie/${m.id}`} key={m.id} className="card card-medium">
						<div className='similar-card-img-wrapper'>
							{m.poster_path ? (
								<img src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} alt={m.title} />
							) : (
								<NoImageIcon className='img-placeholder' />
							)}
						</div>
						<p className='similar-card-title'>{m.title}</p>
					</Link>
				))}
			</div>
		</section>
	)
}

export default SimilarMovies
