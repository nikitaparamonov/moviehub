import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CastCredit, CrewCredit, fetchMediaCredits, fetchMediaDetails, MovieDetails, TVDetails } from '../api/tmdb'
import MiniHeader from '../components/MiniHeader'
import '../components/css/MediaCast.css'
import CrewGrouped from '../components/cast/CrewGrouped'
import { ActorItem } from '../components/cast/ActorItem'

const FullCastPage: React.FC = () => {
	const { mediaType, mediaId } = useParams<{ mediaType: string; mediaId: string }>()
	const id = Number(mediaId)

	const [cast, setCast] = useState<CastCredit[]>([])
	const [crew, setCrew] = useState<CrewCredit[]>([])
	const [mediaDetails, setMediaDetails] = useState<MovieDetails | TVDetails>()
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!mediaType || !id) return

		setLoading(true)
		setError(null)

		Promise.all([
			fetchMediaDetails(mediaType as 'movie' | 'tv', id),
			fetchMediaCredits(mediaType as 'movie' | 'tv', id),
		])
			.then(([details, credits]) => {
				setMediaDetails(details)
				setCast(credits.cast)
				setCrew(credits.crew)
			})
			.catch((err) => {
				console.error(err)
				setError(err?.message ?? 'Failed to load data')
			})
			.finally(() => {
				setLoading(false)
			})
	}, [mediaType, id])

	const memoizedCastList = useMemo(() => cast.map((actor) => <ActorItem key={actor.id} actor={actor} />), [cast])
	const memoizedCrew = useMemo(() => crew, [crew])

	if (loading) return <div>Loading...</div>
	if (error) return <div>{error}</div>

	return (
		<div className="flex-column center">
			{mediaDetails && <MiniHeader md={mediaDetails} link={`/${mediaType}/${mediaId}`} />}
			<div className="cast-content-wrapper flex-row">
				<div className="cast-content flex-column">
					<h2 className="cast-group-title">
						Cast <span className="cast-people-count">{cast.length}</span>
					</h2>
					<ul className="flex-list flex-column gap-10">{memoizedCastList}</ul>
				</div>

				<CrewGrouped crew={memoizedCrew} />
			</div>
		</div>
	)
}

export default FullCastPage
