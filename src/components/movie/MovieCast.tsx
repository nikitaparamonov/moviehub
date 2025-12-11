import React from 'react'
import type { CastCredit } from '../../api/tmdb'
import { Link } from 'react-router-dom'
import { ReactComponent as NoImageIcon } from '../icons/NoImageIcon.svg'

interface MovieCastProps<T extends 'movie' | 'tv'> {
	cast: CastCredit[]
	mediaType: T
}

const MovieCast = <T extends 'movie' | 'tv'>({ cast, mediaType }: MovieCastProps<T>) => {
	return (
		<section className="content-block">
			{mediaType === 'movie' && <h3>Top Billed Cast</h3>}
			{mediaType === 'tv' && <h3>Series Cast</h3>}
			<div className="horizontal-scroll-container">
				{cast.map((c, i) => (
					<Link to={`/person/${c.id}`} key={`${c.id}-${i}`} className="card card-small cast-card">
						<div className='cast-card-img-wrapper'>
							{c.profile_path ? (
								<img src={`https://image.tmdb.org/t/p/w200${c.profile_path}`} alt={c.name} />
							) : (
								<NoImageIcon className="img-placeholder" />
							)}
						</div>
						<p className="cast-name">{c.name}</p>
						<p className="cast-role">{c.character}</p>
					</Link>
				))}
			</div>
		</section>
	)
}

export default MovieCast
