import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { CastCredit, CrewCredit, fetchMediaCredits, fetchMediaDetails, MovieDetails, TVDetails } from "../api/tmdb"
import MiniHeader from "../components/MiniHeader"
import "../components/css/MediaCast.css"

const FullCastPage: React.FC = () => {
    const { mediaType, mediaId } = useParams<{ mediaType: string; mediaId: string }>()
    const id = Number(mediaId)

    const [cast, setCast] = useState<CastCredit[]>([])
    const [crew, setCrew] = useState<CrewCredit[]>([])
    const [mediaDetails, setMediaDetails] = useState<MovieDetails | TVDetails>()

    useEffect(() => {
        if (!mediaType || !id) return

        fetchMediaDetails(mediaType as 'movie' | 'tv', id).then(data => { setMediaDetails(data) })
        fetchMediaCredits(mediaType as 'movie' | 'tv', id).then(data => {
            setCast(data.cast)
            setCrew(data.crew)
        })
    }, [mediaType, id])

    return (
        <div className="flex-column center">
            {mediaDetails && <MiniHeader md={mediaDetails} link={`/${mediaType}/${mediaId}`} />}
            <div className="cast-content-wrapper">
                <div className="flex-column">
                    <h2>Series Cast</h2>
                    <ul className="flex-list flex-column">
                        {cast.map((actor) => (
                            <li key={actor.id} className="cast-member flex-row">
                                {actor.profile_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w66_and_h66_face${actor.profile_path}`}
                                        alt={actor.name}
                                        className="cast-member-photo"
                                    />
                                )}
                                <div className="cast-member-info flex-column">
                                    <p>{actor.name}</p>
                                    <p>{actor.character}</p>
                                </div>
                                

                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default FullCastPage
