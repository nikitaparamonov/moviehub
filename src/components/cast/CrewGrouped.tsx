import React, { useMemo } from 'react'
import type { CrewCredit } from '../../api/tmdb'
import { ImageWithFallback } from '../ui/ImageWithFallback'

interface CrewGroupedProps {
	crew: CrewCredit[]
}

interface PersonInDept {
	id: number
	name: string
	profile_path: string | null
	jobs: string[]
}

type CrewGroupedType = Record<string, Record<number, PersonInDept>>

const groupCrewByDepartment = (crew: CrewCredit[]): CrewGroupedType => {
	const grouped: CrewGroupedType = {}

	crew.forEach((person) => {
		const dept = person.department ?? 'Other'

		if (!grouped[dept]) grouped[dept] = {}

		const entry = grouped[dept][person.id]
		const profilePath = person.profile_path ?? null
		const job = person.job

		if (!entry) {
			grouped[dept][person.id] = {
				id: person.id,
				name: person.name,
				profile_path: profilePath,
				jobs: job ? [job] : [],
			}
		} else {
			if (job && !entry.jobs.includes(job)) entry.jobs.push(job)
			if (!entry.profile_path && profilePath) entry.profile_path = profilePath
		}
	})

	return grouped
}

const CrewGrouped: React.FC<CrewGroupedProps> = ({ crew }) => {
	const groupedCrew = useMemo(() => groupCrewByDepartment(crew), [crew])
	const departmentKeys = Object.keys(groupedCrew).sort()

	return (
		<div className="cast-content flex-column">
			<h2 className="cast-group-title">
				Crew <span className="cast-people-count">{crew.length}</span>
			</h2>
			<div className="flex-column gap-20">
				{departmentKeys.map((dept) => (
					<div key={dept} className="crew-department flex-column">
						<h4 className="crew-department-title">{dept}</h4>
						<ul className="flex-list flex-column gap-10">
							{Object.values(groupedCrew[dept]).map((person) => (
								<li
									key={person.id}
									className="cast-member flex-row"
									aria-label={`${person.name}, ${person.jobs.join(', ') || 'No job listed'}`}
								>
									<ImageWithFallback
										src={
											person.profile_path
												? `https://image.tmdb.org/t/p/w66_and_h66_face${person.profile_path}`
												: null
										}
										alt={`Portrait of ${person.name}`}
										className="cast-member-portrait"
										type="portrait"
									/>
									<div className="cast-member-info flex-column">
										<p>{person.name}</p>
										<p>{person.jobs.length > 0 ? person.jobs.join(', ') : '—'}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	)
}

export default React.memo(CrewGrouped)
