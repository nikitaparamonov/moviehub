import React from 'react'
import type { MediaSummary } from '../../api/tmdb'
import HorizontalScrollBlock, { HorizontalScrollItem } from '../ui/HorizontalScrollBlock'
import '../css/HorizontalScrollBlock.css'

interface SimilarMediaProps<T extends 'movie' | 'tv'> {
	items: MediaSummary<T>[]
	type: T
}

function getMediaLink<T extends 'movie' | 'tv'>(item: MediaSummary<T>, type: T) {
	const title = 'title' in item ? item.title : item.name
	const route = type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`
	return { title, route }
}

const SimilarMedia = <T extends 'movie' | 'tv'>({ items, type }: SimilarMediaProps<T>) => {
	const scrollItems: HorizontalScrollItem[] = items.map((item) => {
		const { title, route } = getMediaLink(item, type)

		return {
			id: item.id,
			to: route,
			title,
			image: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null,
			imageType: 'poster',
			imageClassName: 'card-image-wrapper',
			titleClassName: 'card-title',
		}
	})
	return (
		<HorizontalScrollBlock
			heading="Recommendations"
			ariaLabel="recommendations-heading"
			items={scrollItems}
		/>
	)
}

export default React.memo(SimilarMedia)
