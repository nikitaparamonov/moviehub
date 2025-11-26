import React from 'react'
import { Link } from 'react-router-dom'
import './css/MovieSection.css'

interface Movie {
	id: number
	title: string
	posterUrl: string
}

interface MovieSectionProps {
	title: string
	movies: Movie[]
}

// Horizontal scroll section for movies
const MovieSection: React.FC<MovieSectionProps> = ({ title, movies }) => {
	return (
		<section className='movie-section'>
			<h2>{title}</h2>
			<div className="movie-row">
				{movies.map((movie) => (
					<Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
                        <div className='movie-card-inner'>
                            <img src={movie.posterUrl} alt={movie.title} />
                            <p>{movie.title}</p>
                        </div>
					</Link>
				))}
			</div>
		</section>
	)
}

export default MovieSection
