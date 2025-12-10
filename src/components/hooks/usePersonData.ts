import { useState, useEffect } from 'react'
import { fetchPersonDetails, fetchPersonCombinedCredits } from '../../api/tmdb'
import type { PersonDetails, CastCredit, CrewCredit, CombinedPersonCredits } from '../../api/tmdb'

// Define a unified type for credits (cast + crew)
type PersonCredit = CastCredit | CrewCredit

export function usePersonData(personId: number) {
	const [person, setPerson] = useState<PersonDetails | null>(null)
	const [credits, setCredits] = useState<PersonCredit[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let mounted = true
		setLoading(true)
		setError(null)

		async function load() {
			try {
				const [details, combined]: [PersonDetails, CombinedPersonCredits] = await Promise.all([
					fetchPersonDetails(personId),
					fetchPersonCombinedCredits(personId),
				])

				if (!mounted) return

				setPerson(details)
				setCredits([...combined.cast, ...combined.crew])
			} catch (err: any) {
				if (!mounted) return
				setError(err.message ?? 'Unknown error')
			} finally {
				if (!mounted) return
				setLoading(false)
			}
		}

		load()
		return () => {
			mounted = false
		}
	}, [personId])

	return { person, credits, loading, error }
}
