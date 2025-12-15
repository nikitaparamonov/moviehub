import { useEffect, useState } from 'react'
import { fetchPopularMovies, fetchMediaVideos, TrailerItem } from '../../api/tmdb'

export function useLatestTrailers(maxItems: number = 20) {
    const [items, setItems] = useState<TrailerItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const load = async () => {
            setLoading(true)

            try {
                const movies = await fetchPopularMovies()

                // Fetch videos in parallel for movies with backdrop_path
                const videoPromises = movies
                    .filter(m => m.backdrop_path)
                    .slice(0, maxItems * 2) // slightly overfetch to ensure enough trailers
                    .map(async movie => {
                        const videos = await fetchMediaVideos('movie', movie.id)
                        const trailer = videos.results.find(
                            v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
                        )

                        if (!trailer) return null
                        
                        return {
                            id: movie.id,
                            title: movie.title,
                            trailerName: trailer.name,
                            videoKey: trailer.key,
                            backdrop_path: movie.backdrop_path,
                        } as TrailerItem
                    })

                const results = await Promise.all(videoPromises)
                const filtered = results.filter(Boolean).slice(0, maxItems) as TrailerItem[]

                if (!cancelled) {
                    setItems(filtered)
                }
            } catch (err) {
                console.error('Failed to load trailers:', err)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [maxItems])

    return { items, loading }
}
