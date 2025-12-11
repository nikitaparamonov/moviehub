import React, { useMemo, useState } from 'react'
import { MovieDetails, TVDetails, type Review } from '../../api/tmdb'
import { formatDate } from '../../utils/date'
import { Link } from 'react-router-dom'
import { createPreviewNodes, parseReview } from '../../utils/parseReview'
import { ImageWithFallback } from '../ui/ImageWithFallback'

interface ReviewCardProps {
	review: Review
	movieDetails: MovieDetails | TVDetails
}

const MAX_PREVIEW_CHARS = 500

const ReviewCard: React.FC<ReviewCardProps> = ({ review, movieDetails }) => {
	const [expanded] = useState(false)

	const fullText = review.content.trim()

	// Full parsed nodes for expanded view
	const parsedFull = parseReview(fullText)

	// Safe preview nodes
	const previewNodes = useMemo(() => {
		if (fullText.length <= MAX_PREVIEW_CHARS) return parsedFull
		return createPreviewNodes(
			fullText,
			MAX_PREVIEW_CHARS,
			<Link to={`/review/${review.id}`} state={{ review, movieDetails }} className="review-content-link">
				Read the rest
			</Link>,
		)
	}, [fullText, movieDetails, parsedFull, review])

	return (
		<li key={review.id} className="card review-card">
			<div className="review-header">
				{/* Avatar */}
				<ImageWithFallback
					src={review.author_details.avatar_path ? `https://media.themoviedb.org/t/p/w45_and_h45_face${review.author_details.avatar_path}` : null}
					alt={`Avatar of ${review.author_details.name}`}
					className="review-author-avatar"
					type="poster"
				/>

				{/* Author + rating + date */}
				<div className="flex-column">
					<h3 className="review-author">A review by {review.author}</h3>
					<div>
						{review.author_details.rating != null && (
							<span className="review-rating">Rating: {review.author_details.rating}/10</span>
						)}
						<span className="review-date"> Written on {formatDate(review.created_at)}</span>
					</div>
				</div>
			</div>

			{/* Review content */}
			<div className="review-content">{expanded ? parsedFull : previewNodes}</div>
		</li>
	)
}

export default ReviewCard
