import type { MediaPanelItem } from '../components/media-page/MediaPanel'
import type { Video, Image } from '../api/tmdb'
import { getLanguageName } from './lang'

type MediaDataItem = Video | Image

// Fixed video tab order
const movieVideoTypes = ['Trailers', 'Teasers', 'Clips', 'Behind the Scenes', 'Bloopers', 'Featurettes']
const tvVideoTypes = [...movieVideoTypes, 'Opening Credits']

export const normalizeTabName = (tab: string) => {
	if (tab === 'Behind the Scenes' || tab === 'Opening Credits') return tab
	return tab.slice(0, -1) // remove last 's'
}

/**
 * Generates tabs for MediaPanel based on media items
 * - Videos → always return fixed list of types (movie vs tv) with counts
 * - Images → grouped by country
 * @param items Array of media items (Video or Image)
 * @param mediaType 'movie' | 'tv'
 * @param mediaId Media ID for generating URLs
 * @param basePath Base path for the link, e.g., 'videos', 'images/posters'
 * @param defaultType Fallback type for unknown items (optional)
 */
export const getMediaTabsForPanel = (
	items: MediaDataItem[],
	mediaType: 'movie' | 'tv',
	mediaId: number,
	basePath: string,
	defaultType?: string,
): MediaPanelItem[] => {
	if (items.length === 0) return []

	// Check if first item is a Video to apply fixed video tabs
	if ('type' in items[0]) {
		const types = mediaType === 'tv' ? tvVideoTypes : movieVideoTypes
		return types.map((type) => {
			const count = (items as Video[]).filter((v) => v.type === normalizeTabName(type)).length
			return {
				type,
				count,
				href: `/${mediaType}/${mediaId}/${basePath}?active_nav_item=${encodeURIComponent(type)}`,
			}
		})
	}

	// Otherwise, treat as images (Posters/Backdrops)
	const grouped = items.reduce<Record<string, MediaDataItem[]>>((acc, item) => {
		let key: string

		if ('iso_639_1' in item) {
			// Group images by country
			key = getLanguageName(item.iso_639_1) || 'No Language'
		} else {
			// fallback
			key = defaultType ?? 'Other'
		}

		if (!acc[key]) acc[key] = []
		acc[key].push(item)
		return acc
	}, {})

	return Object.entries(grouped).map(([type, groupItems]) => ({
		type,
		count: groupItems.length,
		href: `/${mediaType}/${mediaId}/${basePath}?active_nav_item=${encodeURIComponent(type)}`,
	}))
}
