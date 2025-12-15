import React from 'react'
import { MovieDetails } from '../../api/tmdb'
import HorizontalScrollBlock, { HorizontalScrollItem } from '../ui/HorizontalScrollBlock'
import '../css/HorizontalScrollBlock.css'
import '../css/home/HomePage.css'

interface MovieSectionProps {
	movies?: MovieDetails[]
}

const TrendingMovies: React.FC<MovieSectionProps> = ({ movies }) => {
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
		<div className='trending-section'>
			<HorizontalScrollBlock
				items={scrollItems}
				heading="Trending"
				ariaLabel="trending-heading"
			/>
		</div>
	)
}

export default TrendingMovies
