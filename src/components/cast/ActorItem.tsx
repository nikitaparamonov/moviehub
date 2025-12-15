import React from 'react'
import { CastCredit } from '../../api/tmdb'
import { ImageWithFallback } from '../ui/ImageWithFallback'

interface ActorItemProps {
	actor: CastCredit
}

export const ActorItem: React.FC<ActorItemProps> = React.memo(({ actor }) => (
	<li className="cast-member flex-row" aria-label={`${actor.name}, ${actor.character || 'No character listed'}`}>
		<ImageWithFallback
			src={actor.profile_path ? `https://image.tmdb.org/t/p/w66_and_h66_face${actor.profile_path}` : null}
			alt={`Portrait of ${actor.name}`}
			className="cast-member-portrait"
			type="portrait"
		/>
		<div className="cast-member-info flex-column">
			<p>{actor.name}</p>
			<p>{actor.character || '—'}</p>
		</div>
	</li>
))
