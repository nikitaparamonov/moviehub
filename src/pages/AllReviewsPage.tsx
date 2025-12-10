import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMediaDetails, fetchMovieReviews, MovieDetails, TVDetails, type Review } from '../api/tmdb'
import ReviewCard from '../components/movie/ReviewCard'
import '../components/css/ReviewPage.css'
import MiniHeader from '../components/MiniHeader'

const AllReviewsPage: React.FC = () => {
	const { movieId } = useParams<{ movieId: string }>()
	const [movieDetails, setMovieDetails] = useState<MovieDetails | TVDetails | null>(null)
	const [reviews, setReviews] = useState<Review[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!movieId) return

		const fetchData = async () => {
			setLoading(true)
			try {
				const details = await fetchMediaDetails('movie', Number(movieId))
				setMovieDetails(details)

				const fetchedReviews = await fetchMovieReviews('movie', Number(movieId))
				setReviews(fetchedReviews)
			} catch (err) {
				console.error('Failed to fetch movie details or reviews', err)
				setMovieDetails(null)
				setReviews([])
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [movieId])

	// Prevent rendering before data is available
	if (loading || !movieDetails) return <div>Loading...</div>

	return (
		<div className="reviews-page flex-column center">
			{/* MiniHeader with link back to movie page */}
			<MiniHeader md={movieDetails} link={`/movie/${movieDetails.id}`} />

			{/* List of all reviews */}
			<ul className="reviews-list flex-column gap-20">
				{reviews.map((rev) => (
					<ReviewCard key={rev.id} review={rev} movieDetails={movieDetails} />
				))}
			</ul>
		</div>
	)
}

export default AllReviewsPage
