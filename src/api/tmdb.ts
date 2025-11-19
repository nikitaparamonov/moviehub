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
