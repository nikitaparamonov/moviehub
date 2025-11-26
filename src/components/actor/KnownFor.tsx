import { useMemo } from 'react'
import { PersonCredit } from '../../api/tmdb'
import { Link } from 'react-router-dom'

interface PersonalInfoProps {
	actingCredits: PersonCredit[]
}

const KnownFor: React.FC<PersonalInfoProps> = ({ actingCredits }) => {
	// Top 6 Known For by vote_count
	const knownFor = useMemo(() => {
		return actingCredits
			.filter((c) => c.poster_path)
			.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
			.slice(0, 6)
	}, [actingCredits])

	return (
		<>
			{knownFor.length > 0 && (
				<section className="known-for">
					<h3 className="known-for-title">Known For</h3>
					<div className="known-for-row">
						{knownFor.map((c) => (
							<Link to={`/${c.media_type}/${c.id}`} className="known-for-card" key={c.id}>
								<img src={`https://image.tmdb.org/t/p/w300${c.poster_path}`} alt={c.title || c.name} />
								<p>{c.title || c.name}</p>
							</Link>
						))}
					</div>
				</section>
			)}
		</>
	)
}

export default KnownFor
