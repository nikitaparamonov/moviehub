import React from 'react'
import { MovieDetails, TVDetails, type Review } from '../../api/tmdb'
import { Link } from 'react-router-dom'
import ReviewCard from './ReviewCard'
import Empty from '../Empty'
import "../css/movie-page/ReviewsBlock.css"

interface MovieReviewBlockProps {
	movieDetails: MovieDetails | TVDetails
	allReviews: Review[]
	randomReview?: Review
}

const MovieReviewBlock: React.FC<MovieReviewBlockProps> = ({ movieDetails, allReviews, randomReview }) => {
	if (!randomReview) {
		return (
			<section className="content-block">
				<h3>Social</h3>
				<div style={{ paddingLeft: '10px' }}>
					<Empty text="No reviews found"/>
				</div>
			</section>
		)
	}

	const movieId = movieDetails?.id

	return (
		<section className="content-block" aria-labelledby="review-heading">
			<h3>Social</h3>
			<ReviewCard review={randomReview} movieDetails={movieDetails} />
			<div className="review-read-all">
				{movieId && (
					<Link
						to={`/movie/${movieId}/reviews`}
						state={{ movieDetails, allReviews }}
						className="review-read-all-link"
					>
						Read all reviews
					</Link>
				)}
			</div>
		</section>
	)
}

export default MovieReviewBlock
