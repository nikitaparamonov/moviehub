import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Header'
import MediaInfo, { MediaBase } from '../components/movie/MediaInfo'
import MovieCast from '../components/movie/MovieCast'
import MediaBlock from '../components/movie/MediaBlock'
import SimilarMedia from '../components/movie/SimilarMedia'
import MovieReviewBlock from '../components/movie/MovieReviewBlock'
import { useMediaPageData } from '../components/hooks/useMediaPageData'
import MediaSidebar from '../components/movie/MediaSidebar'

const TVPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const mediaId = Number(id)

	// Use generic hook for TV
	const { data, loading, error, randomReview, top10Cast } = useMediaPageData('tv', mediaId)

	if (loading) return <div className="loading">Loading...</div>
	if (error || !data || !data.details || !data.credits)
		return <div className="error">{error || 'TV Show not found'}</div>

	// Map TVDetails to MediaBase for MediaInfo
	const media: MediaBase = {
		id: data.details.id,
		title: data.details.name,
		overview: data.details.overview,
		poster_path: data.details.poster_path,
		backdrop_path: data.details.backdrop_path,
		releaseDate: data.details.first_air_date,
		genres: data.details.genres.map((g) => ({ id: g.id, name: g.name })),
		tagline: data.details.tagline,
		crew: data.details.created_by.map((c: { id: number; name: string; }) => ({ id: c.id, name: c.name, jobs: ['Creator'] })),
		runtime: undefined, // TV shows may not have runtime; optional: calculate average episode length
		certification: data.certification,
		tvType: data.details.type,
		mediaType: "tv",
	}

	return (
		<>
			<Header />

			<div className="movie-page flex-column">
				<MediaInfo media={media} />

				<div className="movie-column-wrapper flex">
					<div className="movie-column-left flex-column gap-30">
						{top10Cast.length > 0 && <MovieCast cast={top10Cast} mediaType={media.mediaType} mediaId={data.details.id} />}
						<MovieReviewBlock
							movieDetails={data.details}
							allReviews={data.reviews}
							randomReview={randomReview}
						/>
						<MediaBlock media={data.media} mediaType={media.mediaType} mediaId={data.details.id} />
						{data.similar.length > 0 && <SimilarMedia items={data.similar} type="tv" />}
					</div>

					<MediaSidebar details={data.details} external={data.external} keywords={data.keywords} />
				</div>
			</div>

			<Footer />
		</>
	)
}

export default TVPage
