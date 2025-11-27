import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	fetchMediaDetails,
	fetchMediaCredits,
	fetchMediaImages,
	fetchSimilarMedia,
	fetchMovieReleaseDates,
} from '../api/tmdb'
import type { MovieDetails, MovieCredits, Image, MovieSummary, TVDetails, TVCredits, TVSummary } from '../api/tmdb'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MovieInfo from '../components/movie/MovieInfo'
import MovieCast from '../components/movie/MovieCast'
import MovieGallery from '../components/movie/MovieGallery'
import SimilarMovies from '../components/movie/SimilarMovies'
import '../components/css/MoviePage.css'
import { formatReleaseDate } from '../utils/date'

interface MoviePageProps {
	type: 'movie' | 'tv'
}

interface MoviePageData {
	media: MovieDetails | TVDetails | null
	credits: MovieCredits | TVCredits | null
	images: Image[]
	similar: MovieSummary[] | TVSummary[]
	certification?: string
	releaseDate?: string
}

// Fetches certification and release date for a movie
async function getCertification(movieId: number, country = 'US') {
	const releaseDates = await fetchMovieReleaseDates(movieId)
	const countryRelease = releaseDates.find((r) => r.iso_3166_1 === country)
	const rawDate = countryRelease?.release_dates[0]?.release_date

	return {
		certification: countryRelease?.release_dates[0]?.certification ?? '',
		releaseDate: rawDate ? `${formatReleaseDate(rawDate)}` : '',
	}
}

async function loadMovieData(id: number) {
	const [media, credits, images, similar] = await Promise.all([
		fetchMediaDetails('movie', id),
		fetchMediaCredits('movie', id),
		fetchMediaImages('movie', id),
		fetchSimilarMedia('movie', id),
	])
	const { certification, releaseDate } = await getCertification(id)
	return { media, credits, images, similar, certification, releaseDate }
}

async function loadTVData(id: number) {
	const [media, credits, images, similar] = await Promise.all([
		fetchMediaDetails('tv', id),
		fetchMediaCredits('tv', id),
		fetchMediaImages('tv', id),
		fetchSimilarMedia('tv', id),
	])
	return { media, credits, images, similar }
}

const MoviePage: React.FC<MoviePageProps> = ({ type }) => {
	const { id } = useParams()
	const mediaId = Number(id)

	const [data, setData] = useState<MoviePageData>({
		media: null,
		credits: null,
		images: [],
		similar: [],
		certification: '',
		releaseDate: '',
	})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function load() {
			try {
				const result = type === 'movie' ? await loadMovieData(mediaId) : await loadTVData(mediaId)
				setData(result)
			} catch (err) {
				if (err instanceof Error) setError(err.message)
				else setError(String(err))
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [mediaId, type])

	// Memoize cast and crew to avoid unnecessary recalculations on re-renders
	const cast = useMemo(() => {
		if (!data.credits || !('cast' in data.credits)) return []
		return data.credits.cast.filter((c) => c.character)
	}, [data.credits])
	const crew = useMemo(() => {
		if (!data.credits || !('crew' in data.credits)) return []
		return data.credits.crew.filter((c) => c.job)
	}, [data.credits])

	if (loading) return <div className="loading">Loading...</div>
	if (error || !data.media || !data.credits) return <div className="error">{error || 'Movie not found'}</div>

	// Prepare media props with unified title for movies or TV shows
	const mediaProps: MovieDetails | TVDetails = {
		...(data.media as MovieDetails | TVDetails),
		title: 'title' in data.media ? data.media.title : data.media.name,
	}

	return (
		<>
			<Header />
			<div className="movie-page">
				<MovieInfo movie={mediaProps} crew={crew} certification={data.certification} releaseDate={data.releaseDate} />
				{cast.length > 0 && <MovieCast cast={cast} />}
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
