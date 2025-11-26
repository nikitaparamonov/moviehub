import { useMemo, useState } from "react"
import { PersonCredit } from "../../api/tmdb"

interface PersonalInfoProps {
    actingCredits: PersonCredit[]
    crewCredits: PersonCredit[]
}

const Filmography: React.FC<PersonalInfoProps> = ({actingCredits, crewCredits}) => {
	const [activeTab, setActiveTab] = useState<'acting' | 'crew'>('acting')

	// Helper function to parse a date string and return a timestamp
	const parseTime = (c: PersonCredit) => {
		const s = c.first_air_date || c.release_date || ''
		const t = s ? Date.parse(s) : 0
		return Number.isFinite(t) ? t : 0
	}

	// Group credits by year for the filmography
	const filmographyByYear = useMemo(() => {
		const list = (activeTab === 'acting' ? actingCredits : crewCredits).slice()

		// Sort credits descending by release/air date using parseTime
		list.sort((a, b) => {
			const tA = parseTime(a)
			const tB = parseTime(b)
			return tB - tA
		})

		// Group the sorted credits by year
		const grouped: Record<string, PersonCredit[]> = {}
		for (const item of list) {
			const year = (item.release_date || item.first_air_date || '').slice(0, 4)
			if (!grouped[year]) grouped[year] = []
			grouped[year].push(item)
		}

		// Get an array of years sorted descending, with '' first
		const years = Object.keys(grouped).sort((a, b) => {
			if (a === '') return -1
			if (b === '') return 1
			return Number(b) - Number(a)
		})

		return { grouped, years }
	}, [actingCredits, crewCredits, activeTab])

	return (
		<section className="filmography">
			<div className="filmography-tabs">
				<button className={activeTab === 'acting' ? 'active' : ''} onClick={() => setActiveTab('acting')}>
					Acting
				</button>
				<button className={activeTab === 'crew' ? 'active' : ''} onClick={() => setActiveTab('crew')}>
					Crew
				</button>
			</div>

			{/* Grouped-by-year filmography */}
			<div className="filmography-grouped">
				{filmographyByYear.years.map((year) => (
					<div key={year} className="filmography-year-block">
						<div className="filmography-year">{year}</div>
						<div className="filmography-items">
							{filmographyByYear.grouped[year].map((c, index) => (
								<div className="filmography-row" key={`${c.id}-${c.character ?? c.job ?? ''}-${index}`}>
									<p className="filmography-title-text">{c.title || c.name}</p>
									{c.character && <p className="filmography-role-text">as {c.character}</p>}
									{!c.character && c.job && <p className="filmography-role-text">{c.job}</p>}
								</div>
							))}
						</div>
					</div>
				))}
				{filmographyByYear.years.length === 0 && <div className="filmography-empty">No credits found.</div>}
			</div>
		</section>
	)
}

export default Filmography
