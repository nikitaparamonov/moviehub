import { useState, useEffect } from 'react'
import { fetchPersonDetails, fetchPersonCombinedCredits } from '../../api/tmdb'
import type { PersonDetails, PersonCredit } from '../../api/tmdb'

export function usePersonData(personId: number) {
	const [person, setPerson] = useState<PersonDetails | null>(null)
	const [credits, setCredits] = useState<PersonCredit[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function load() {
			try {
				const [details, combined] = await Promise.all([
					fetchPersonDetails(personId),
					fetchPersonCombinedCredits(personId),
				])
				setPerson(details)
				setCredits([...combined.cast, ...combined.crew])
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [personId])

	return { person, credits, loading, error }
}
