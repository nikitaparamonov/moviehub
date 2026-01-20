import { MoviesFilterForm } from './types'

// Builds the query parameters for TMDB discover/movie endpoint based on the selected filters from the form
export const buildDiscoverParams = (form: MoviesFilterForm) => {
	const params: Record<string, string | number> = {}

	// Language filter
	if (form.language) {
		params.with_original_language = form.language
	}

	// Genres (multi-select)
	if (form.genres.length > 0) {
		params.with_genres = form.genres.join(',')
	}

	// Certifications (multi-select)
	if (form.certifications.length > 0) {
		params.certification = form.certifications.join(',')
		params.certification_country = 'US'
	}

	// Release date range
	if (form.from) params['primary_release_date.gte'] = form.from
	if (form.to) params['primary_release_date.lte'] = form.to

	// Show Me (everything/watched/unwatched)
	if (form.showMe && form.showMe !== 'everything') {
		params.show_me = form.showMe
	}

	return params
}
