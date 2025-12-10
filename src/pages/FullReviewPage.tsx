import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { MovieDetails, TVDetails, type Review } from '../api/tmdb'
import { formatDate, getYear } from '../utils/date'
import '../components/css/ReviewPage.css'
import { parseReview } from '../utils/parseReview'

interface LocationState {
	review: Review
	movieDetails: MovieDetails | TVDetails
}

const FullReviewPage: React.FC = () => {
	const { review, movieDetails } = useLocation().state as LocationState

	const movieTitle = 'title' in movieDetails ? movieDetails.title : movieDetails.name
	const posterUrl = movieDetails.poster_path ? `https://image.tmdb.org/t/p/w220_and_h330_face${movieDetails.poster_path}` : null

    function getMediaReleaseDate(media: MovieDetails | TVDetails): string | undefined {
		if ('release_date' in media) return media.release_date
		if ('first_air_date' in media) return media.first_air_date
		return undefined
	}

	return (
		<div className="flex-column center">
			{/* Back to main */}
			<div className="full-review-back-wrapper center">
				<div className="full-review-back">
					<h3>
						<Link to={`/movie/${movieDetails.id}/reviews`} className="full-review-back-text">
							← Back to main
						</Link>
					</h3>
				</div>
			</div>

			<div className="full-review-content flex-row gap-20 center">
				{/* Poster */}
				<div className='full-review-sidebar'>{posterUrl && <img src={posterUrl} alt={movieTitle} className="full-review-poster" />}</div>

				<div className='flex-column'>
					<h2>
						<Link to={`/movie/${movieDetails.id}`} state={{ movieDetails }} className="full-review-title">
							{movieTitle}
						</Link>
                        <span className="full-review-title-year"> ({getYear(getMediaReleaseDate(movieDetails))})</span>
					</h2>

					<div className="flex-row full-review-author">
						<div className='full-review-rating'>Rating: {review.author_details.rating}/10</div>
						<h3 className="full-review-date"> Written by {review.author_details.name} on {formatDate(review.created_at)}</h3>
					</div>

					<article className="full-review-content-text">
						{parseReview(review.content)}
					</article>
				</div>
			</div>
		</div>
	)
}

export default FullReviewPage
