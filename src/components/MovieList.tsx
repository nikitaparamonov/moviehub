import React from 'react'
import MovieSection from '../components/MovieSection'
import { Movie } from '../api/tmdb'

interface MovieListProps {
	title: string
	movies: Movie[] | null
	loading: boolean
}

const MovieList: React.FC<MovieListProps> = ({ title, movies, loading }) => {
	// Format movies for MovieSection
	const formatMovies = (movies: Movie[]) =>
		movies.map((m) => ({
			id: m.id,
			title: m.title,
			posterUrl: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
		}))

	if (loading) {
		return <p style={{ color: '#fff', textAlign: 'center' }}>Loading {title}...</p>
	}

	if (!movies || movies.length === 0) {
		return <p style={{ color: '#fff', textAlign: 'center' }}>No {title} found</p>
	}

	return <MovieSection title={title} movies={formatMovies(movies)} />
}

export default MovieList
