import React from 'react'
import { MovieDetails } from '../../api/tmdb'
import HorizontalScrollBlock, { HorizontalScrollItem } from '../ui/HorizontalScrollBlock'
import '../css/HorizontalScrollBlock.css'

interface MovieSectionProps {
	title: string
	movies?: MovieDetails[]
}

const TrendingMovies: React.FC<MovieSectionProps> = ({ title, movies }) => {
	const moviesList = movies ?? []

	const scrollItems: HorizontalScrollItem[] = moviesList.map((movie) => ({
		id: movie.id,
		to: `/movie/${movie.id}`,
		title: movie.title,
		image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
		imageType: 'poster',
		imageClassName: 'card-image-wrapper',
		titleClassName: 'card-title',
	}))

	return (
		<HorizontalScrollBlock
			items={scrollItems}
			heading={title}
			ariaLabel="trending-heading"
		/>
	)
}

export default TrendingMovies
