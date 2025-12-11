import React from 'react'
import { Link } from 'react-router-dom'
import { ImageWithFallback } from './ImageWithFallback'

/**
 * Universal horizontal scroll block
 */
export interface HorizontalScrollItem {
	id: number | string
	to: string
	title?: string
	subtitle?: string
	image: string | null
	imageType: 'poster' | 'portrait'
	imageClassName?: string
    titleClassName?: string
    subtitleClassName?: string
}

interface HorizontalScrollBlockProps {
	heading?: string
	ariaLabel?: string
	items: HorizontalScrollItem[]
	itemClass?: string
	listClass?: string
}

const HorizontalScrollBlock: React.FC<HorizontalScrollBlockProps> = ({
	heading,
	ariaLabel,
	items,
	itemClass = 'card-medium',
	listClass = 'horizontal-scroll-container flex-list',
}) => {
	return (
		<section className="content-block" aria-labelledby={ariaLabel}>
			{heading && <h3 id={ariaLabel}>{heading}</h3>}

			<ul className={listClass}>
				{items.map((item) => (
					<li key={item.id} className={itemClass}>
						<Link to={item.to} className="card flex-column">
							{item.image && (
								<ImageWithFallback
									src={item.image}
									alt={item.title || 'Image'}
									className={item.imageClassName}
									type={item.imageType}
								/>
							)}
							{item.title && <p className={item.titleClassName}>{item.title}</p>}
							{item.subtitle && <p className={item.subtitleClassName}>{item.subtitle}</p>}
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}

export default HorizontalScrollBlock
