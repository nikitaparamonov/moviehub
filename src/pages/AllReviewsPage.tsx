import React from 'react'
import { useLocation } from 'react-router-dom'
import { MovieDetails, TVDetails, type Review } from '../api/tmdb'
import ReviewCard from '../components/movie/ReviewCard'
import '../components/css/ReviewPage.css'
import MiniHeader from '../components/MiniHeader'

interface LocationState {
	movieDetails: MovieDetails | TVDetails
	allReviews: Review[]
}

const AllReviewsPage: React.FC = () => {
	const location = useLocation()
	const state = location.state as LocationState
	const md = state.movieDetails
	const reviews = state.allReviews
	
	return (
		<div className='reviews-page flex-column center'>
			<MiniHeader md={md} link={`/movie/${md.id}/reviews`} />
			<ul className="reviews-list flex-column gap-20">
				{reviews.map((rev) => (
					<ReviewCard key={rev.id} review={rev} movieDetails={md} />
				))}
			</ul>
		</div>
	)
}

export default AllReviewsPage
