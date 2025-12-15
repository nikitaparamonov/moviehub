import React, { useEffect, useState } from 'react'
import { fetchLatestTrailers, TrailerItem } from '../../api/tmdb'
import "../css/home/LatestTrailers.css"
import '../css/home/HomePage.css'
import { ReactComponent as VideoPlayIcon } from '../icons/video-play-icon.svg'

const LatestTrailers: React.FC = () => {
    const [trailers, setTrailers] = useState<TrailerItem[]>([])
    const [loading, setLoading] = useState(true)
    const [background, setBackground] = useState<string | null>(null) // store only path

    // Helper to build full image URL
    const getBackdropUrl = (path?: string | null) =>
        path ? `https://media.themoviedb.org/t/p/w1920_and_h427_multi_faces${path}` : null

    useEffect(() => {
        const loadTrailers = async () => {
            try {
                const data = await fetchLatestTrailers(10)
                setTrailers(data)
                setBackground(getBackdropUrl(data[0]?.backdrop_path)) // first trailer backdrop
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        };
        loadTrailers();
    }, []);

    if (loading) return <div>Loading trailers...</div>;

    return (
        <div className='latest-trailer-section center' style={{ backgroundImage: `url(${background || 'black'})` }}>
            <div className='background-overlay'></div>
            <section className="latest-trailers">
                <h3 className='latest-trailers-title'>Latest Trailers</h3>
                <div className="trailer-grid flex-row">
                    {trailers.map(trailer => (
                        <div key={trailer.id} className="trailer-card">
                            <a
                                href={`https://www.youtube.com/watch?v=${trailer.videoKey}`}
                                className='trailer-card-backdrop'
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() =>
                                    setBackground(getBackdropUrl(trailer.backdrop_path)) // hover backdrop
                                }
                            >
                                {trailer.backdrop_path ? (
                                    <>
                                        <img
                                            src={`https://image.tmdb.org/t/p/w355_and_h200_multi_faces${trailer.backdrop_path}`}
                                            alt={trailer.title}
                                        />
                                        <div className='trailer-card-play'>
                                            <VideoPlayIcon />
                                        </div>
                                    </>
                                ) : (
                                    <div className="fallback-image">No image</div>
                                )}
                            </a>
                            <h2 className='trailer-card-title'>{trailer.title}</h2>
                            <h3 className='trailer-card-subtitle'>{trailer.trailerName}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default LatestTrailers