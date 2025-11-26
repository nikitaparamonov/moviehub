import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMediaDetails, fetchMediaCredits, fetchMediaImages, fetchSimilarMedia } from '../api/tmdb'
import type { MovieDetails, MovieCredits, Image, MovieSummary, TVDetails, TVCredits, TVSummary } from '../api/tmdb'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MovieInfo from '../components/movie/MovieInfo'
import MovieCast from '../components/movie/MovieCast'
import MovieCrew from '../components/movie/MovieCrew'
import MovieGallery from '../components/movie/MovieGallery'
import SimilarMovies from '../components/movie/SimilarMovies'
import '../components/css/MoviePage.css'

interface MoviePageProps {
	type: 'movie' | 'tv'
}

interface MoviePageData {
	media: MovieDetails | TVDetails | null
	credits: MovieCredits | TVCredits | null
	images: Image[]
	similar: MovieSummary[] | TVSummary[]
}

const MoviePage: React.FC<MoviePageProps> = ({ type }) => {
	const { id } = useParams()
	const mediaId = Number(id)

	const [data, setData] = useState<MoviePageData>({ media: null, credits: null, images: [], similar: [] })
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function load() {
			try {
				const [media, credits, images, similar] = await Promise.all([
					fetchMediaDetails(type, mediaId),
					fetchMediaCredits(type, mediaId),
					fetchMediaImages(type, mediaId),
					fetchSimilarMedia(type, mediaId),
				])

				setData({ media, credits, images, similar: similar })
			} catch (err) {
				if (err instanceof Error) setError(err.message)
				else setError(String(err))
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [mediaId, type])

	const cast = useMemo(() => data.credits?.cast.filter((c) => c.character) || [], [data.credits])
	const crew = useMemo(() => data.credits?.crew.filter((c) => c.job) || [], [data.credits])

	if (loading) return <div className="loading">Loading...</div>
	if (error || !data.media || !data.credits) return <div className="error">{error || 'Movie not found'}</div>

	return (
		<>
			<Header />
			<div className="movie-page">
				<MovieInfo
					movie={{
						...(data.media as MovieDetails | TVDetails),
						title: 'title' in data.media ? data.media.title : data.media.name,
					}}
				/>
				{cast.length > 0 && <MovieCast cast={cast} />}
				{crew.length > 0 && <MovieCrew crew={crew} />}
				{data.images.length > 0 && <MovieGallery images={data.images} />}
				{data.similar.length > 0 && (
					<SimilarMovies
						movies={data.similar.map((m) => ({
							...(m as MovieSummary | TVSummary),
							title: 'title' in m ? m.title : m.name,
						}))}
					/>
				)}
			</div>
			<Footer />
		</>
	)
}

export default MoviePage
