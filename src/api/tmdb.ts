// ===========================
// TMDB API configuration
// ===========================

export const BASE_URL = 'https://api.themoviedb.org/3'
export const API_KEY = process.env.REACT_APP_TMDB_API_KEY

if (!API_KEY) {
	console.warn('REACT_APP_TMDB_API_KEY is not defined in your .env file. API requests will fail.')
}

// ===========================
// Base interfaces
// ===========================

interface BaseMedia {
	id: number
	poster_path?: string | null
	backdrop_path?: string | null
	overview?: string
	popularity?: number
	vote_count?: number
	vote_average?: number
}

interface BaseCredit {
	id: number
	name: string
	profile_path?: string | null
	popularity?: number
}

export interface CastCredit extends BaseCredit {
	character?: string
	order?: number
	cast_id?: number
}

export interface CrewCredit extends BaseCredit {
	job?: string
	department?: string
	jobs?: string[]
}

export interface MediaCredits<T extends CastCredit = CastCredit, U extends CrewCredit = CrewCredit> {
	id: number
	cast: T[]
	crew: U[]
}

export interface Genre {
	id: number
	name: string
}

export interface ProductionCompany {
	id: number
	name: string
	logo_path: string | null
	origin_country: string
}

export interface ProductionCountry {
	iso_3166_1: string
	name: string
}

export interface SpokenLanguage {
	iso_639_1: string
	name: string
	english_name: string
}

export interface BelongsToCollection {
	id: number
	name: string
	poster_path?: string | null
	backdrop_path?: string | null
}

// ===========================
// Media interfaces
// ===========================

export interface MovieDetails extends BaseMedia {
	adult?: boolean
	title: string
	original_title?: string
	original_language?: string
	release_date?: string
	genres: Genre[]
	belongs_to_collection?: BelongsToCollection | null
	budget?: number
	revenue?: number
	runtime?: number
	status?: string
	tagline?: string
	homepage?: string | null
	imdb_id?: string | null
	production_companies?: ProductionCompany[]
	production_countries?: ProductionCountry[]
	spoken_languages?: SpokenLanguage[]
}

export interface TVSeason {
	id: number
	name: string
	overview?: string
	poster_path?: string | null
	season_number: number
	air_date?: string
	episode_count?: number
}

export interface TVDetails extends BaseMedia {
	name: string
	original_name?: string
	original_language?: string
	first_air_date?: string
	last_air_date?: string
	in_production?: boolean
	number_of_seasons?: number
	number_of_episodes?: number
	seasons?: TVSeason[]
	genres: Genre[]
	status?: string
	tagline?: string
	homepage?: string | null
	created_by: { id: number; name: string }[]
	networks?: { id: number; name: string; logo_path?: string | null; origin_country?: string }[]
	production_companies?: ProductionCompany[]
	production_countries?: ProductionCountry[]
	spoken_languages?: SpokenLanguage[]
	type: string
}

// Unified summary types
export type MediaSummary<T extends 'movie' | 'tv'> = BaseMedia & {
	media_type: T
	title?: string // movie
	name?: string // tv
	release_date?: string
	first_air_date?: string
}

// Person interfaces
export interface Person {
	id: number
	media_type: 'person'
	name: string
	profile_path?: string | null
	known_for_department?: string
	known_for?: Array<MovieDetails | TVDetails>
}

export interface PersonDetails {
	id: number
	name: string
	biography: string
	birthday?: string | null
	deathday?: string | null
	place_of_birth?: string | null
	profile_path?: string | null
	also_known_as?: string[]
	known_for_department?: string
	popularity: number
	gender: number
}

export interface CombinedPersonCredits {
	cast: CastCredit[]
	crew: CrewCredit[]
}

export type SearchResult =
	| (MovieDetails & { media_type: 'movie' })
	| (TVDetails & { media_type: 'tv' })
	| (Person & { media_type: 'person' })

// Images & Videos
export interface Image {
	file_path: string
	width: number
	height: number
}

export interface MediaImages {
	id: number
	backdrops: Image[]
	posters: Image[]
}

export interface Video {
	key: string
	name: string
	site: string
	type: string
	published_at: string
}

export interface MediaVideos {
	id: number
	results: Video[]
}

export interface MovieMedia {
	id: number
	backdrops: Image[]
	posters: Image[]
	videos: Video[]
}

// Keywords
export interface Keyword {
	id: number
	name: string
}

export interface MovieKeywordsResponse {
	id: number
	keywords: Keyword[]
}

export interface TvKeywordsResponse {
	id: number
	results: Keyword[]
}

// Reviews
export interface ReviewAuthorDetails {
	name: string
	username: string
	avatar_path: string | null
	rating: number | null
}

export interface Review {
	author: string
	author_details: ReviewAuthorDetails
	content: string
	created_at: string
	id: string
	updated_at: string
	url: string
}

export interface ReviewResponse {
	id: number
	page: number
	results: Review[]
	total_pages: number
	total_results: number
}

// External IDs
export interface ExternalIDsResponse {
	imdb_id: string | null
	facebook_id: string | null
	instagram_id: string | null
	twitter_id: string | null
	wikidata_id: string | null
	youtube_id?: string | null
	freebase_mid?: string | null
	freebase_id?: string | null
	tvdb_id?: number | null
	tvrage_id?: number | null
}

// Release dates
export interface ReleaseDateInfo {
	certification: string
	iso_639_1?: string
	release_date: string
	type: number
	note?: string
}

export interface CountryReleaseDates {
	iso_3166_1: string
	release_dates: ReleaseDateInfo[]
}

export interface TVRating {
	iso_3166_1: string
	rating: string
}

// Trailers
export interface TrailerItem {
	id: number
	title: string
	backdrop_path?: string | null
	videoKey?: string
	trailerName?: string
}

// VideoPage
export interface MediaVideosPageData {
	details: MovieDetails | TVDetails
	videos: Video[]
}

// ===========================
// TMDB fetch wrapper
// ===========================

const DEFAULT_PARAMS = { language: 'en-US', page: 1 }

async function fetchTMDB<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
	if (!API_KEY) throw new Error('TMDB API key is missing')

	const allParams = { api_key: API_KEY, ...DEFAULT_PARAMS, ...params }

	const query = new URLSearchParams(
		Object.fromEntries(Object.entries(allParams).map(([key, value]) => [key, String(value)])),
	)

	const url = `${BASE_URL}${endpoint}?${query.toString()}`

	const response = await fetch(url)
	if (!response.ok) {
		const text = await response.text()
		throw new Error(`TMDB API error: ${response.status} ${text}`)
	}

	return response.json() as Promise<T>
}

// ===========================
// TMDB endpoints
// ===========================

// Popular movies
export const fetchPopularMovies = async () => {
	const data = await fetchTMDB<{ results: MovieDetails[] }>('/movie/popular')
	return data.results
}

// Multi-search
export const fetchSearchMulti = async (query: string, page: number = 1) => {
	return fetchTMDB<{ results: SearchResult[]; total_pages: number; total_results: number }>('/search/multi', {
		query,
		page,
	})
}

// Person details & credits
export const fetchPersonDetails = async (personId: number) => fetchTMDB<PersonDetails>(`/person/${personId}`)
export const fetchPersonCombinedCredits = async (personId: number) =>
	fetchTMDB<CombinedPersonCredits>(`/person/${personId}/combined_credits`)

// Generic media fetch
export type MediaDetails<T extends 'movie' | 'tv'> = T extends 'movie' ? MovieDetails : TVDetails
export const fetchMediaDetails = async <T extends 'movie' | 'tv'>(type: T, id: number): Promise<MediaDetails<T>> =>
	fetchTMDB<MediaDetails<T>>(`/${type}/${id}`)

export const fetchMediaCredits = async <T extends 'movie' | 'tv'>(type: T, id: number): Promise<MediaCredits> =>
	fetchTMDB<MediaCredits>(`/${type}/${id}/credits`)

export const fetchMediaImages = async (type: 'movie' | 'tv', id: number) =>
	fetchTMDB<MediaImages>(`/${type}/${id}/images`)
export const fetchMediaVideos = async (type: 'movie' | 'tv', id: number) =>
	fetchTMDB<MediaVideos>(`/${type}/${id}/videos`)

export const fetchMediaExternalIds = async (type: 'movie' | 'tv', id: number) =>
	fetchTMDB<ExternalIDsResponse>(`/${type}/${id}/external_ids`)

export async function fetchKeywords(type: 'movie' | 'tv', id: number) {
	const data = await fetchTMDB<MovieKeywordsResponse | TvKeywordsResponse>(`/${type}/${id}/keywords`)

	if (type === 'movie') return (data as MovieKeywordsResponse).keywords
	return (data as TvKeywordsResponse).results
}

export const fetchMovieReviews = async (type: 'movie' | 'tv', id: number, page: number = 1) =>
	fetchTMDB<ReviewResponse>(`/${type}/${id}/reviews`, { page }).then((res) => res.results)

// Similar media
export const fetchSimilarMedia = async <T extends 'movie' | 'tv'>(type: T, id: number): Promise<MediaSummary<T>[]> =>
	fetchTMDB<{ results: MediaSummary<T>[] }>(`/${type}/${id}/similar`).then((res) => res.results)

// Release dates
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

// Unified fetch for media
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

// Fetch latest upcoming movies with trailers
export const fetchLatestTrailers = async (limit: number = 10) => {
	// 1. Fetch upcoming movies
	const upcoming = await fetchTMDB<{ results: MovieDetails[] }>('/movie/upcoming', { page: 1 })

	// 2. For each movie, fetch videos and pick the first YouTube trailer
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

	// Return only movies that have trailers
	return trailers.filter((t) => t.videoKey)
}

export const fetchMediaVideosPage = async (type: 'movie' | 'tv', id: number): Promise<MediaVideosPageData> => {
	const [details, videos] = await Promise.all([fetchMediaDetails(type, id), fetchMediaVideos(type, id)])

	return {
		details: details,
		videos: videos.results,
	}
}
