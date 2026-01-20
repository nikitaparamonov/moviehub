// ===========================
// Base Interfaces
// ===========================
// Shared properties for media items like movies and TV shows
interface BaseMedia {
	id: number
	poster_path?: string | null
	backdrop_path?: string | null
	overview?: string
	popularity?: number
	vote_count?: number
	vote_average?: number
}

// Shared properties for person credits (cast and crew)
interface BaseCredit {
	id: number
	name: string
	profile_path?: string | null
	popularity?: number
}

// ===========================
// Credits Interfaces
// ===========================
// Specific cast credit
export interface CastCredit extends BaseCredit {
	character?: string
	order?: number
	cast_id?: number
}

// Specific crew credit
export interface CrewCredit extends BaseCredit {
	job?: string
	department?: string
	jobs?: string[]
}

// Combined cast and crew for a media item
export interface MediaCredits<T extends CastCredit = CastCredit, U extends CrewCredit = CrewCredit> {
	id: number
	cast: T[]
	crew: U[]
}

// ===========================
// Production & Genre Interfaces
// ===========================
// Movie/TV genres
export interface Genre {
	id: number
	name: string
}

// Production company details
export interface ProductionCompany {
	id: number
	name: string
	logo_path: string | null
	origin_country: string
}

// Production country details
export interface ProductionCountry {
	iso_3166_1: string
	name: string
}

// Spoken language information
export interface SpokenLanguage {
	iso_639_1: string
	name: string
	english_name: string
}

// Collection a movie belongs to
export interface BelongsToCollection {
	id: number
	name: string
	poster_path?: string | null
	backdrop_path?: string | null
}

// ===========================
// Media Interfaces
// ===========================
// Detailed movie information
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

// Single TV season information
export interface TVSeason {
	id: number
	name: string
	overview?: string
	poster_path?: string | null
	season_number: number
	air_date?: string
	episode_count?: number
}

// Detailed TV show information
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

// Unified summary type for lists (movie or TV)
export type MediaSummary<T extends 'movie' | 'tv'> = BaseMedia & {
	media_type: T
	title?: string // only for movie
	name?: string // only for TV
	release_date?: string
	first_air_date?: string
}

// ===========================
// Person Interfaces
// ===========================
// Person basic information
export interface Person {
	id: number
	media_type: 'person'
	name: string
	profile_path?: string | null
	known_for_department?: string
	known_for?: Array<MovieDetails | TVDetails>
}

// Detailed person information
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

// Combined credits for a person (cast + crew)
export interface CombinedPersonCredits {
	cast: CastCredit[]
	crew: CrewCredit[]
}

// Result of a search query (movie, TV, or person)
export type SearchResult =
	| (MovieDetails & { media_type: 'movie' })
	| (TVDetails & { media_type: 'tv' })
	| (Person & { media_type: 'person' })

// ===========================
// Images & Videos
// ===========================
export interface Image {
	file_path: string
	width: number
	height: number
	iso_639_1: string
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

// ===========================
// Keywords
// ===========================
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

// ===========================
// Reviews
// ===========================
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

// ===========================
// External IDs
// ===========================
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

// ===========================
// Release Dates & Ratings
// ===========================
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

export type Certification = {
	certification: string
	meaning: string
	order: number
}

// ===========================
// Trailers
// ===========================
export interface TrailerItem {
	id: number
	title: string
	backdrop_path?: string | null
	videoKey?: string
	trailerName?: string
}

// ===========================
// Media Pages
// ===========================
export interface MediaVideosPageData {
	details: MovieDetails | TVDetails
	videos: Video[]
}

export interface MediaVideosBackdropsData {
	details: MovieDetails | TVDetails
	backdrops: Image[]
}

export interface MediaVideosPostersData {
	details: MovieDetails | TVDetails
	posters: Image[]
}

// ===========================
// Languages
// ===========================
export interface Language {
	iso_639_1: string
	english_name: string
	name: string
}

// ===========================
// Discover Movies Interfaces
// ===========================
export interface DiscoverMoviesResponse {
	page: number
	results: MovieDetails[]
	total_results: number
	total_pages: number
}

// Filter options for discover endpoint
export type ShowMeFilter = 'everything' | 'watched' | 'unwatched'

export interface MoviesFilterForm {
	showMe: ShowMeFilter
	language: string | null
	from: string
	to: string
	genres: number[]
	certifications: string[]
}
