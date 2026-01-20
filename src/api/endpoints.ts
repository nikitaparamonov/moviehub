// ===========================
// TMDB endpoints
// ===========================

import { buildDiscoverParams } from './builders'
import { fetchTMDB } from './fetcher'
import {
	Certification,
	CombinedPersonCredits,
	CountryReleaseDates,
	DiscoverMoviesResponse,
	ExternalIDsResponse,
	Genre,
	Language,
	MediaCredits,
	MediaImages,
	MediaSummary,
	MediaVideos,
	MediaVideosBackdropsData,
	MediaVideosPageData,
	MediaVideosPostersData,
	MovieDetails,
	MovieKeywordsResponse,
	MoviesFilterForm,
	PersonDetails,
	ReviewResponse,
	SearchResult,
	TVDetails,
	TvKeywordsResponse,
	TVRating,
	Video,
} from './types'

// ===========================
// Discover & Popular Movies
// ===========================
// Fetch movies from TMDB discover endpoint using filters from the form
export const fetchDiscoverMovies = async (
	form: MoviesFilterForm,
	page: number = 1,
): Promise<DiscoverMoviesResponse> => {
	const params = buildDiscoverParams(form)
	params.page = page

	return fetchTMDB<DiscoverMoviesResponse>('/discover/movie', params)
}

// Fetch the current popular movies
export const fetchPopularMovies = async () => {
	const data = await fetchTMDB<{ results: MovieDetails[] }>('/movie/popular')
	return data.results
}

// ===========================
// Search
// ===========================
// Multi-search across movies, TV shows, and people
export const fetchSearchMulti = async (query: string, page: number = 1) => {
	return fetchTMDB<{ results: SearchResult[]; total_pages: number; total_results: number }>('/search/multi', {
		query,
		page,
	})
}

// ===========================
// Person Details & Credits
// ===========================
// Fetch detailed info for a person
export const fetchPersonDetails = async (personId: number) => fetchTMDB<PersonDetails>(`/person/${personId}`)
// Fetch combined credits (cast + crew) for a person
export const fetchPersonCombinedCredits = async (personId: number) =>
	fetchTMDB<CombinedPersonCredits>(`/person/${personId}/combined_credits`)

// ===========================
// Generic Media Endpoints
// ===========================
// Fetch details for a movie or TV show
export type MediaDetails<T extends 'movie' | 'tv'> = T extends 'movie' ? MovieDetails : TVDetails
export const fetchMediaDetails = async <T extends 'movie' | 'tv'>(type: T, id: number): Promise<MediaDetails<T>> =>
	fetchTMDB<MediaDetails<T>>(`/${type}/${id}`)

// Fetch cast and crew for a movie or TV show
export const fetchMediaCredits = async <T extends 'movie' | 'tv'>(type: T, id: number): Promise<MediaCredits> =>
	fetchTMDB<MediaCredits>(`/${type}/${id}/credits`)

// Fetch images and videos for a movie or TV show
export const fetchMediaImages = async (type: 'movie' | 'tv', id: number) =>
	fetchTMDB<MediaImages>(`/${type}/${id}/images`)
export const fetchMediaVideos = async (type: 'movie' | 'tv', id: number) =>
	fetchTMDB<MediaVideos>(`/${type}/${id}/videos`)

// Fetch external IDs for a movie or TV show (IMDB, Facebook, etc.)
export const fetchMediaExternalIds = async (type: 'movie' | 'tv', id: number) =>
	fetchTMDB<ExternalIDsResponse>(`/${type}/${id}/external_ids`)

// Fetch keywords for a movie or TV show
export async function fetchKeywords(type: 'movie' | 'tv', id: number) {
	const data = await fetchTMDB<MovieKeywordsResponse | TvKeywordsResponse>(`/${type}/${id}/keywords`)

	if (type === 'movie') return (data as MovieKeywordsResponse).keywords
	return (data as TvKeywordsResponse).results
}

// Fetch reviews for a movie or TV show
export const fetchMovieReviews = async (type: 'movie' | 'tv', id: number, page: number = 1) =>
	fetchTMDB<ReviewResponse>(`/${type}/${id}/reviews`, { page }).then((res) => res.results)

// Fetch similar movies or TV shows
export const fetchSimilarMedia = async <T extends 'movie' | 'tv'>(type: T, id: number): Promise<MediaSummary<T>[]> =>
	fetchTMDB<{ results: MediaSummary<T>[] }>(`/${type}/${id}/similar`).then((res) => res.results)

// Fetch release dates or content ratings
export const fetchMediaReleaseData = async (type: 'movie' | 'tv', id: number) => {
	if (type === 'movie') {
		return fetchTMDB<{ results: CountryReleaseDates[] }>(`/${type}/${id}/release_dates`).then((res) => ({
			type: 'movie' as const,
			releaseDates: res.results,
		}))
	}

	return fetchTMDB<{ results: TVRating[] }>(`/tv/${id}/content_ratings`).then((res) => ({
		type: 'tv' as const,
		ratings: res.results,
	}))
}

// Unified fetch combining details, credits, images, and videos
export const fetchFullMedia = async (type: 'movie' | 'tv', id: number) => {
	const [details, credits, images, videos] = await Promise.all([
		fetchMediaDetails(type, id),
		fetchMediaCredits(type, id),
		fetchMediaImages(type, id),
		fetchMediaVideos(type, id),
	])

	return {
		details,
		credits,
		images,
		videos: videos.results,
	} as {
		details: MediaDetails<typeof type>
		credits: MediaCredits
		images: MediaImages
		videos: Video[]
	}
}

// ===========================
// Trailers & Latest Upcoming Movies
// ===========================
// Fetch upcoming movies and attach first YouTube trailer
export const fetchLatestTrailers = async (limit: number = 10) => {
	const upcoming = await fetchTMDB<{ results: MovieDetails[] }>('/movie/upcoming', { page: 1 })

	const trailers = await Promise.all(
		upcoming.results.slice(0, limit).map(
			async (
				movie,
			): Promise<{
				id: number
				title: string
				backdrop_path?: string | null
				videoKey?: string
				trailerName?: string
			}> => {
				const videos = await fetchTMDB<MediaVideos>(`/movie/${movie.id}/videos`)
				const trailer = videos.results.find((v) => v.site === 'YouTube' && v.type.toLowerCase() === 'trailer')
				return {
					id: movie.id,
					title: movie.title,
					backdrop_path: movie.backdrop_path,
					videoKey: trailer?.key,
					trailerName: trailer?.name,
				}
			},
		),
	)

	return trailers.filter((t) => t.videoKey)
}

// ===========================
// Media Pages (Videos, Backdrops, Posters)
// ===========================
export const fetchMediaVideosPage = async (type: 'movie' | 'tv', id: number): Promise<MediaVideosPageData> => {
	const [details, videos] = await Promise.all([fetchMediaDetails(type, id), fetchMediaVideos(type, id)])

	return {
		details: details,
		videos: videos.results,
	}
}

export const fetchMediaBackdropsPage = async (type: 'movie' | 'tv', id: number): Promise<MediaVideosBackdropsData> => {
	const [details, images] = await Promise.all([fetchMediaDetails(type, id), fetchMediaImages(type, id)])

	return {
		details: details,
		backdrops: images.backdrops,
	}
}

export const fetchMediaPostersPage = async (type: 'movie' | 'tv', id: number): Promise<MediaVideosPostersData> => {
	const [details, images] = await Promise.all([fetchMediaDetails(type, id), fetchMediaImages(type, id)])

	return {
		details: details,
		posters: images.posters,
	}
}

// ===========================
// Supporting Data (Genres, Certifications, Languages)
// ===========================
// Fetch all movie genres
export const fetchMovieGenres = async (): Promise<Genre[]> => {
	const data = await fetchTMDB<{ genres: Genre[] }>('/genre/movie/list')
	return data.genres
}

// Fetch movie certifications by country
export const fetchMovieCertifications = async (country = 'US'): Promise<Certification[]> => {
	const data = await fetchTMDB<{ certifications: Record<string, Certification[]> }>('/certification/movie/list')
	return data.certifications[country] || []
}

// Fetch all available languages
export const fetchLanguages = async () => {
	return fetchTMDB<Language[]>('/configuration/languages')
}
