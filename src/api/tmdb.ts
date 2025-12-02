// ===========================
// TMDB API configuration
// ===========================

export const BASE_URL = 'https://api.themoviedb.org/3'
export const API_KEY = process.env.REACT_APP_TMDB_API_KEY
if (!API_KEY) {
	throw new Error('REACT_APP_TMDB_API_KEY is not defined in your .env file')
}

// ===========================
// TMDB data types
// ===========================

export interface Person {
	id: number
	media_type: 'person'
	name: string
	profile_path?: string | null
	known_for_department?: string
	known_for?: Array<MovieTV>
}

export interface Movie {
	id: number
	media_type: 'movie'
	title: string
	overview?: string
	poster_path?: string | null
	release_date?: string
}

export interface TV {
	id: number
	media_type: 'tv'
	name: string
	overview?: string
	poster_path?: string | null
	first_air_date?: string
}

export type MovieTV = Movie | TV
export type SearchResult = MovieTV | Person

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

export interface PersonCredit {
	id: number
	media_type: 'movie' | 'tv'
	title?: string
	name?: string
	poster_path?: string | null
	character?: string
	job?: string
	release_date?: string
	first_air_date?: string
	overview?: string
	popularity: number
	vote_average: number
	vote_count: number
}

export interface CombinedPersonCredits {
	cast: PersonCredit[]
	crew: PersonCredit[]
}

export interface MovieDetails {
	id: number
	title: string
	overview?: string
	poster_path?: string | null
	backdrop_path?: string | null
	release_date?: string
	runtime?: number
	genres: { id: number; name: string }[]
	tagline?: string
	vote_average?: number
	vote_count?: number
	popularity?: number
	budget?: number
	revenue?: number
	status?: string
	original_language?: string
	homepage?: string
}

export interface MovieCastCredit {
	id: number
	name: string
	character?: string
	profile_path?: string | null
	cast_id?: number
	order?: number
}

export interface MovieCrewCredit {
	id: number
	name: string
	job?: string
	profile_path?: string | null
	department?: string
}

export interface MovieCredits {
	id: number
	cast: MovieCastCredit[]
	crew: MovieCrewCredit[]
}

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

export interface MovieSummary {
	id: number
	title: string
	poster_path?: string | null
	release_date?: string
}

export interface TVDetails {
	id: number
	name: string
	overview?: string
	poster_path?: string | null
	backdrop_path?: string | null
	first_air_date?: string
	last_air_date?: string
	number_of_seasons?: number
	number_of_episodes?: number
	genres: { id: number; name: string }[]
	vote_average?: number
	vote_count?: number
	popularity?: number
	tagline?: string
	budget?: number
	revenue?: number
	status?: string
	original_language?: string
	homepage?: string
}

export interface TVCastCredit {
	id: number
	name: string
	character?: string
	profile_path?: string | null
	order?: number
}

export interface TVCrewCredit {
	id: number
	name: string
	job?: string
	department?: string
	profile_path?: string | null
}

export interface TVCredits {
	id: number
	cast: TVCastCredit[]
	crew: TVCrewCredit[]
}

export interface TVSummary {
	id: number
	name: string
	poster_path?: string | null
	first_air_date?: string
}

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

export interface MovieReleaseDatesResponse {
	results: CountryReleaseDates[]
}

export interface ExternalIDsResponse {
	imdb_id: string | null
	facebook_id: string | null
	instagram_id: string | null
	twitter_id: string | null
	wikidata_id: string | null
	youtube_id?: string | null

	// TV-specific fields (TMDB returns them even if null)
	freebase_mid?: string | null
	freebase_id?: string | null
	tvdb_id?: number | null
	tvrage_id?: number | null
}

export interface Keyword {
	id: number
	name: string
}

export interface MediaKeywordsResponse {
	keywords?: Keyword[] // for movies
	results?: Keyword[] // for TV
}

// ===========================
// TMDB fetch wrapper
// ===========================

/**
 * Generic function to fetch data from TMDB API.
 * Automatically appends API_KEY to all requests.
 * @param endpoint - API endpoint
 * @param params - optional query parameters
 * @returns Parsed JSON data as type T
 */
async function fetchTMDB<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
	// Combine API key with other query parameters
	const query = new URLSearchParams({ api_key: API_KEY, ...params } as Record<string, string>)
	const url = `${BASE_URL}${endpoint}?${query.toString()}`

	const response = await fetch(url)

	// Throw an error if the response status is not OK
	if (!response.ok) {
		const text = await response.text()
		throw new Error(`TMDB API error: ${response.status} ${text}`)
	}

	const data: T = await response.json()
	return data
}

// ===========================
// TMDB endpoints
// ===========================

// Fetch popular movies
export const fetchPopularMovies = async () => {
	const data = await fetchTMDB<{ results: Movie[] }>('/movie/popular', { language: 'en-US', page: 1 })
	return data.results
}

// Multi-search across movies, TV shows and people
export const fetchSearchMulti = async (query: string, page: number = 1) => {
	const data = await fetchTMDB<{ results: SearchResult[]; total_pages: number; total_results: number }>(
		'/search/multi',
		{ query, page },
	)
	return data
}

// Fetch a person's details
export const fetchPersonDetails = async (personId: number) => {
	const data = await fetchTMDB<PersonDetails>(`/person/${personId}`, {
		language: 'en-US',
	})
	return data
}

// Fetch combined credits (movies + TV)
export const fetchPersonCombinedCredits = async (personId: number) => {
	const data = await fetchTMDB<CombinedPersonCredits>(`/person/${personId}/combined_credits`, {
		language: 'en-US',
	})
	return data
}

// Universal fetch functions for movies & TV
export const fetchMediaDetails = async (type: 'movie' | 'tv', id: number) => {
	const data = await fetchTMDB<MovieDetails | TVDetails>(`/${type}/${id}`, { language: 'en-US' })
	return data
}

export const fetchMediaCredits = async (type: 'movie' | 'tv', id: number) => {
	const data = await fetchTMDB<MovieCredits | TVCredits>(`/${type}/${id}/credits`)
	return data
}

export const fetchMediaImages = async (type: 'movie' | 'tv', id: number) => {
	const data = await fetchTMDB<MediaImages>(`/${type}/${id}/images`)
	return data
}

export const fetchMediaVideos = async (type: 'movie' | 'tv', id: number) => {
	const data = await fetchTMDB<MediaVideos>(`/${type}/${id}/videos`)
	return {
		id: data.id,
		videos: data.results,
	}
}

export const fetchMedia = async (type: 'movie' | 'tv', id: number): Promise<MovieMedia> => {
	const [images, videosData] = await Promise.all([fetchMediaImages(type, id), fetchMediaVideos(type, id)])

	return {
		id: images.id,
		backdrops: images.backdrops,
		posters: images.posters,
		videos: videosData.videos,
	}
}

export const fetchSimilarMedia = async (type: 'movie' | 'tv', id: number) => {
	const data = await fetchTMDB<{ results: MovieSummary[] | TVSummary[] }>(`/${type}/${id}/similar`, {
		language: 'en-US',
		page: 1,
	})
	return data.results
}

// Fetch release dates (including certifications) for a movie
export const fetchMovieReleaseDates = async (movieId: number): Promise<CountryReleaseDates[]> => {
	const data = await fetchTMDB<MovieReleaseDatesResponse>(`/movie/${movieId}/release_dates`)
	return data.results
}

// Fetch external IDs (social networks & other external links)
export const fetchMediaExternalIds = async (type: 'movie' | 'tv', id: number) => {
	const data = await fetchTMDB<ExternalIDsResponse>(`/${type}/${id}/external_ids`)
	return data
}

// Fetch keywords for movies and TV and always return a flat array of Keyword[].
export const fetchKeywords = async (type: 'movie' | 'tv', id: number): Promise<Keyword[]> => {
	const data = await fetchTMDB<MediaKeywordsResponse>(`/${type}/${id}/keywords`)
	return data.keywords ?? data.results ?? []
}
