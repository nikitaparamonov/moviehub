import { useMemo } from 'react'
import { CastCredit, MediaSummary } from '../../api/tmdb'
import { Link } from 'react-router-dom'

interface KnownForProps {
	actingCredits: Array<CastCredit & Partial<MediaSummary<'movie' | 'tv'>>>
}

const KnownFor: React.FC<KnownForProps> = ({ actingCredits }) => {
	// Top 6 Known For by vote_count (if available)
	const knownFor = useMemo(() => {
		return actingCredits
			.filter((c) => c.poster_path) // only show items with posters
			.slice(0, 6)
	}, [actingCredits])

	return (
		<>
			{knownFor.length > 0 && (
				<section className="known-for">
					<h3 className="known-for-title">Known For</h3>
					<div className="known-for-row">
						{knownFor.map((c) => {
							const title = c.title ?? c.name ?? 'Untitled'
							const mediaType = c.media_type ?? 'movie'
							const poster = c.poster_path ? `https://image.tmdb.org/t/p/w300${c.poster_path}` : ''
							return (
								<Link
									to={`/${mediaType}/${c.id}`}
									className="known-for-card"
									key={`${mediaType}-${c.id}`}
								>
									<img src={poster} alt={title} />
									<p>{title}</p>
								</Link>
							)
						})}
					</div>
				</section>
			)}
		</>
	)
}

export default KnownFor
