import React from 'react'
import type { MovieDetails } from '../../api/tmdb'
import { formatDate } from '../../utils/date'

interface MovieInfoProps {
	movie: MovieDetails
}

const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
	return (
		<div className="movie-info">
			{movie.poster_path && (
				<img
					src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
					alt={movie.title}
					className="movie-poster"
				/>
			)}
			<div className="movie-details">
				<h2>{movie.title}</h2>
				{movie.tagline && <p className="movie-tagline">{movie.tagline}</p>}
				<p>
					<strong>Release Date:</strong> {formatDate(movie.release_date)}
				</p>
				<p>
					<strong>Runtime:</strong> {movie.runtime} min
				</p>
				<p>
					<strong>Genres:</strong> {movie.genres.map((g) => g.name).join(', ')}
				</p>
				{movie.overview && <p className="movie-overview">{movie.overview}</p>}
			</div>
		</div>
	)
}

export default MovieInfo
