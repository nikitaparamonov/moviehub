export function getLanguageName(code?: string, locale = 'en') {
	if (!code) return 'No Language'
	return new Intl.DisplayNames([locale], { type: 'language' }).of(code)
}
