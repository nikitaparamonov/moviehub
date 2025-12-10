import { useMemo, useState } from 'react'
import { CastCredit, CrewCredit, MediaSummary } from '../../api/tmdb'

interface FilmographyProps {
	actingCredits: Array<CastCredit & Partial<MediaSummary<'movie' | 'tv'>>>
	crewCredits: Array<CrewCredit & Partial<MediaSummary<'movie' | 'tv'>>>
}

const Filmography: React.FC<FilmographyProps> = ({ actingCredits, crewCredits }) => {
	const [activeTab, setActiveTab] = useState<'acting' | 'crew'>('acting')

	// Helper function to parse a date string and return a timestamp
	const parseTime = (c: CastCredit | (CrewCredit & Partial<MediaSummary<'movie' | 'tv'>>)) => {
		const s = (c as any).first_air_date || (c as any).release_date || ''
		const t = s ? Date.parse(s) : 0
		return Number.isFinite(t) ? t : 0
	}

	// Group credits by year for the filmography
	const filmographyByYear = useMemo(() => {
		const list = (activeTab === 'acting' ? actingCredits : crewCredits).slice()

		// Sort credits descending by release/air date using parseTime
		list.sort((a, b) => parseTime(b) - parseTime(a))

		// Group the sorted credits by year
		const grouped: Record<string, typeof list> = {}
		for (const item of list) {
			const year = ((item as any).release_date || (item as any).first_air_date || '').slice(0, 4)
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
							{filmographyByYear.grouped[year].map((c, index) => {
								const title = (c as any).title || (c as any).name || 'Untitled'
								const role = (c as any).character || (c as any).job
								return (
									<div className="filmography-row" key={`${(c as any).id}-${role ?? ''}-${index}`}>
										<p className="filmography-title-text">{title}</p>
										{role && (
											<p className="filmography-role-text">
												{(c as any).character ? `as ${role}` : role}
											</p>
										)}
									</div>
								)
							})}
						</div>
					</div>
				))}
				{filmographyByYear.years.length === 0 && <div className="filmography-empty">No credits found.</div>}
			</div>
		</section>
	)
}

export default Filmography
