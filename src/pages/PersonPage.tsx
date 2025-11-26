import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PersonCredit } from '../api/tmdb'
import { usePersonData } from '../components/hooks/usePersonData'
import '../components/css/PersonPage.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Biography from '../components/actor/Biography'
import PersonalInfo from '../components/actor/PersonalInfo'
import KnownFor from '../components/actor/KnownFor'
import Filmography from '../components/actor/Filmography'

const PersonPage: React.FC = () => {
	const { id } = useParams()
	const personId = Number(id)

	const { person, credits, loading, error } = usePersonData(personId)
	const [actingCredits, setActingCredits] = useState<PersonCredit[]>([])
	const [crewCredits, setCrewCredits] = useState<PersonCredit[]>([])

	useEffect(() => {
		if (!credits.length) return

        // Separate Acting/Crew credits
		const acting = credits.filter((c) => c.character)
		const crew = credits.filter((c) => c.job && !c.character)

		setActingCredits(acting)
		setCrewCredits(crew)
	}, [credits])

	if (loading) return <div className="loading">Loading...</div>
	if (error) return <div className="error">Error: {error}</div>
	if (!person) return null

	return (
		<>
			<Header />
			<div className="person-page">
				{/* Photo + Personal Info */}
				<PersonalInfo person={person} />

				{/* Main Content */}
				<div className="person-content">
					<h2 className="person-name">{person.name}</h2>

					{/* Biography */}
					<Biography person={person} />

					{/* Known For */}
					<KnownFor actingCredits={actingCredits} />

					{/* Filmography Tabs*/}
					<Filmography actingCredits={actingCredits} crewCredits={crewCredits} />
				</div>
			</div>
			<Footer />
		</>
	)
}

export default PersonPage