// Format a date string to "Month Day, Year" ("February 17, 2017")
export const formatDate = (dateString?: string): string => {
	if (!dateString) return ''
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

// Extract just the year from a date string ("2017")
export const getYear = (dateString?: string): string => {
	if (!dateString) return ''
	const date = new Date(dateString)
	return date.getFullYear().toString()
}

// Format a release date with country code ("02/17/2017 (US)")
export const formatReleaseDate = (dateString?: string, countryCode = 'US'): string => {
	if (!dateString) return ''
	const date = new Date(dateString)
	const formattedDate = date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
	return `${formattedDate} (${countryCode})`
}

// Convert runtime in minutes to "Xh Ym" format (103 → "1h 43m")
export const formatRuntime = (minutes?: number): string => {
	if (!minutes) return ''
	const h = Math.floor(minutes / 60)
	const m = minutes % 60
	return `${h > 0 ? `${h}h ` : ''}${m}m`
}
