export function getLanguageName(code?: string, locale = 'en') {
	if (!code) return 'Unknown'
	return new Intl.DisplayNames([locale], { type: 'language' }).of(code)
}
