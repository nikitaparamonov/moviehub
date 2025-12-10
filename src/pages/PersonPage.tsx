import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CastCredit, CrewCredit } from '../api/tmdb'
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
	const [castCredits, setCastCredits] = useState<CastCredit[]>([])
	const [crewCredits, setCrewCredits] = useState<CrewCredit[]>([])

	useEffect(() => {
		if (!credits.length) return

		const isCastCredit = (c: CastCredit | CrewCredit): c is CastCredit => 'character' in c
		const isCrewCredit = (c: CastCredit | CrewCredit): c is CrewCredit => 'job' in c

		const acting = credits.filter(isCastCredit)
		const crew = credits.filter(isCrewCredit)

		setCastCredits(acting)
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
					<KnownFor actingCredits={castCredits} />

					{/* Filmography Tabs*/}
					<Filmography actingCredits={castCredits} crewCredits={crewCredits} />
				</div>
			</div>
			<Footer />
		</>
	)
}

export default PersonPage
