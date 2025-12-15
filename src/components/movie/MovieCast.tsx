import React from 'react'
import type { CastCredit } from '../../api/tmdb'
import HorizontalScrollBlock, { HorizontalScrollItem } from '../ui/HorizontalScrollBlock'
import { Link } from 'react-router-dom'
import '../css/HorizontalScrollBlock.css'

interface MovieCastProps {
	cast: CastCredit[]
	mediaType: 'movie' | 'tv'
	mediaId: number
}

const MovieCast: React.FC<MovieCastProps> = ({ cast, mediaType, mediaId }) => {
	const scrollItems: HorizontalScrollItem[] = cast.map((c) => ({
		id: c.id,
		to: `/person/${c.id}`,
		title: c.name,
		subtitle: c.character,
		image: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
		imageType: 'portrait',
		imageClassName: 'cast-card-img-wrapper',
		titleClassName: 'cast-name',
		subtitleClassName: 'cast-role',
	}))

	const heading = mediaType === 'movie' ? 'Top Billed Cast' : 'Series Cast'

	return (
		<div>
			<HorizontalScrollBlock
				heading={heading}
				ariaLabel="cast-heading"
				items={scrollItems}
				itemClass="card-small"
			/>

			<div className="full-cast">
				<Link to={`/${mediaType}/${mediaId}/cast`} className="full-cast-link">
					Full Cast & Crew
				</Link>
			</div>
		</div>
	)
}

export default React.memo(MovieCast)
