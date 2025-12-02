import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	fetchMediaDetails,
	fetchMediaCredits,
	fetchSimilarMedia,
	fetchMovieReleaseDates,
	fetchMedia,
	fetchMediaExternalIds,
	fetchKeywords,
} from '../api/tmdb'
import type {
	MovieDetails,
	MovieCredits,
	MovieSummary,
	TVDetails,
	TVCredits,
	TVSummary,
	MovieMedia,
	ExternalIDsResponse,
	Keyword,
} from '../api/tmdb'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MovieInfo from '../components/movie/MovieInfo'
import MovieCast from '../components/movie/MovieCast'
import MediaBlock from '../components/movie/MediaBlock'
import SimilarMovies from '../components/movie/SimilarMovies'
import '../components/css/MoviePage.css'
import { formatReleaseDate } from '../utils/date'
import SocialLinks from '../components/movie/SocialLinks'

interface MoviePageProps {
	type: 'movie' | 'tv'
}

interface MoviePageData {
	details: MovieDetails | TVDetails | null
	credits: MovieCredits | TVCredits | null
	media: MovieMedia | null
	similar: MovieSummary[] | TVSummary[]
	external: ExternalIDsResponse | null
	keywords: Keyword[]
	certification?: string
	releaseDate?: string
}

function formatNumber(num: number): string {
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(num)
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
	const [details, credits, media, similar, external, keywords] = await Promise.all([
		fetchMediaDetails('movie', id),
		fetchMediaCredits('movie', id),
		fetchMedia('movie', id),
		fetchSimilarMedia('movie', id),
		fetchMediaExternalIds('movie', id),
		fetchKeywords('movie', id),
	])
	const { certification, releaseDate } = await getCertification(id)
	return { details, credits, media, similar, external, keywords, certification, releaseDate }
}

async function loadTVData(id: number) {
	const [details, credits, media, similar, external, keywords] = await Promise.all([
		fetchMediaDetails('tv', id),
		fetchMediaCredits('tv', id),
		fetchMedia('tv', id),
		fetchSimilarMedia('tv', id),
		fetchMediaExternalIds('tv', id),
		fetchKeywords('tv', id),
	])
	return { details, credits, media, similar, external, keywords }
}

const MoviePage: React.FC<MoviePageProps> = ({ type }) => {
	const { id } = useParams()
	const mediaId = Number(id)

	const [data, setData] = useState<MoviePageData>({
		details: null,
		credits: null,
		media: null,
		similar: [],
		external: null,
		keywords: [],
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

	// Take only first 10 cast members
	const top10Cast = useMemo(() => cast.slice(0, 10), [cast])

	if (loading) return <div className="loading">Loading...</div>
	if (error || !data.details || !data.credits) return <div className="error">{error || 'Movie not found'}</div>

	// Prepare media props with unified title for movies or TV shows
	const mediaProps: MovieDetails | TVDetails = {
		...(data.details as MovieDetails | TVDetails),
		title: 'title' in data.details ? data.details.title : data.details.name,
	}

	return (
		<>
			<Header />
			<div className="movie-page flex-column">
				<MovieInfo
					movie={mediaProps}
					crew={crew}
					certification={data.certification}
					releaseDate={data.releaseDate}
				/>
				<div className="movie-column-wrapper flex">
					<div className="movie-column-left flex-column gap-30">
						{cast.length > 0 && <MovieCast cast={top10Cast} />}
						<MediaBlock media={data.media} />
						{data.similar.length > 0 && (
							<SimilarMovies
								movies={data.similar.map((m) => ({
									...(m as MovieSummary | TVSummary),
									title: 'title' in m ? m.title : m.name,
								}))}
							/>
						)}
					</div>
					<div className="movie-column-right flex-column flex-wrap gap-20">
						<section className="movie-social-links">
							<SocialLinks
								imdb_id={data.external?.imdb_id}
								wikidata_id={data.external?.wikidata_id}
								facebook_id={data.external?.facebook_id}
								instagram_id={data.external?.instagram_id}
								twitter_id={data.external?.twitter_id}
								homepage={data.details.homepage}
							/>
						</section>
						<section className="movie-release-info">
							<p>
								<strong>
									<bdi>Status</bdi>
								</strong>
								{data.details.status}
							</p>
							<p>
								<strong>
									<bdi>Original Language</bdi>
								</strong>
								{data.details.original_language}
							</p>
							<p>
								<strong>
									<bdi>Budget</bdi>
								</strong>
								${data.details.budget && formatNumber(data.details.budget)}
							</p>
							<p>
								<strong>
									<bdi>Revenue</bdi>
								</strong>
								${data.details.revenue && formatNumber(data.details.revenue)}
							</p>
						</section>
						<section className="movie-keywords">
							{data.keywords.map((k) => (
								<button key={k.id} className="keyword-btn">
									{k.name}
								</button>
							))}
						</section>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default MoviePage
