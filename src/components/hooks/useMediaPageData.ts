import { useEffect, useMemo, useState } from 'react'
import {
	fetchFullMedia,
	fetchMediaExternalIds,
	fetchKeywords,
	fetchSimilarMedia,
	fetchMovieReviews,
	fetchMediaReleaseData,
} from '../../api/tmdb'
import type {
	MovieDetails,
	TVDetails,
	MediaCredits,
	MovieMedia,
	MediaSummary,
	ExternalIDsResponse,
	Keyword,
	Review,
} from '../../api/tmdb'
import { formatReleaseDate } from '../../utils/date'

export interface MediaPageData<T extends 'movie' | 'tv'> {
	details: T extends 'movie' ? MovieDetails : TVDetails
	credits: MediaCredits
	media: MovieMedia
	similar: MediaSummary<T>[]
	external: ExternalIDsResponse
	keywords: Keyword[]
	reviews: Review[]
	certification?: string
	releaseDate?: string
}

async function getMediaCertification(type: "movie" | "tv", id: number) {
	const data = await fetchMediaReleaseData(type, id);

	if (data.type === "movie") {
		const countryRelease = data.releaseDates.find(
			(r) => r.iso_3166_1 === "US"
		);

		const rawDate = countryRelease?.release_dates?.[0]?.release_date;
		const certification = countryRelease?.release_dates?.[0]?.certification ?? "";

		return {
			certification,
			releaseDate: rawDate ? formatReleaseDate(rawDate) : ""
		};
	}

	if (data.type === "tv") {
		const usRating = data.ratings.find((r) => r.iso_3166_1 === "US");

		return { 
			certification: usRating?.rating ?? "", 
			releaseDate: "" 
		}
	}

	// fallback (should not happen)
	return {
		certification: "",
		releaseDate: ""
	}
}

export function useMediaPageData<T extends 'movie' | 'tv'>(type: T, id: number) {
	const [data, setData] = useState<MediaPageData<T> | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [randomReview, setRandomReview] = useState<Review | undefined>()

	useEffect(() => {
		let mounted = true
		setLoading(true)
		setError(null)

		async function load() {
			try {
				// Use fetchFullMedia for unified media fetch
				const [fullMedia, similar, external, keywords, reviews] = await Promise.all([
					fetchFullMedia(type, id),
					fetchSimilarMedia(type, id),
					fetchMediaExternalIds(type, id),
					fetchKeywords(type, id),
					fetchMovieReviews(type, id),
				])

				const media: MovieMedia = {
					id: fullMedia.images.id,
					backdrops: fullMedia.images.backdrops,
					posters: fullMedia.images.posters,
					videos: fullMedia.videos,
				}

				const extra = await getMediaCertification(type, id)

				if (!mounted) return
				setData({
					details: fullMedia.details as T extends 'movie' ? MovieDetails : TVDetails,
					credits: fullMedia.credits,
					media,
					similar,
					external,
					keywords,
					reviews,
					...extra,
				})

				if (reviews.length > 0) setRandomReview(reviews[Math.floor(Math.random() * reviews.length)])
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
	}, [id, type])

	const cast = useMemo(() => data?.credits?.cast ?? [], [data?.credits])
	const crew = useMemo(() => data?.credits?.crew ?? [], [data?.credits])
	const top10Cast = useMemo(() => cast.slice(0, 10), [cast])

	return { data, loading, error, randomReview, cast, crew, top10Cast }
}
