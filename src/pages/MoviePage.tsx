import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MediaInfo, { MediaBase } from '../components/movie/MediaInfo'
import MovieCast from '../components/movie/MovieCast'
import MediaBlock from '../components/movie/MediaBlock'
import SimilarMedia from '../components/movie/SimilarMedia'
import MovieReviewBlock from '../components/movie/MovieReviewBlock'
import { useMediaPageData } from '../components/hooks/useMediaPageData'
import MediaSidebar from '../components/movie/MediaSidebar'


interface GroupedCrew {
	id: number
	name: string
	jobs: string[]
}

const MoviePage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const mediaId = Number(id)

	// Use the generic unified hook
	const { data, loading, error, randomReview, top10Cast } = useMediaPageData('movie', mediaId)

	if (loading) return <div className="loading">Loading...</div>
	if (error || !data || !data.details || !data.credits)
		return <div className="error">{error || 'Movie not found'}</div>

	const importantJobs = ['Director', 'Writer', 'Characters', 'Novel', 'Screenplay', 'Story']

	// Group crew members by ID and filter only important jobs
	const groupedCrew: GroupedCrew[] = Object.values(
		data.credits.crew.reduce<Record<number, GroupedCrew>>((acc, person) => {
			if (!person.job || !importantJobs.includes(person.job)) return acc

			if (!acc[person.id]) {
				acc[person.id] = { id: person.id, name: person.name, jobs: [] }
			}

			// Avoid duplicate jobs
			if (!acc[person.id].jobs.includes(person.job)) {
				acc[person.id].jobs.push(person.job)
			}
			return acc
		}, {}),
	)

	// Sort jobs by priority for each person
	groupedCrew.forEach((person) => {
		person.jobs.sort((a, b) => importantJobs.indexOf(a) - importantJobs.indexOf(b))
	})

	// Sort people by first job priority, then by name
	groupedCrew.sort((a, b) => {
		const jobCompare = importantJobs.indexOf(a.jobs[0]) - importantJobs.indexOf(b.jobs[0])
		if (jobCompare !== 0) return jobCompare
		return a.name.localeCompare(b.name)
	})

	// Map MovieDetails to MediaBase for MediaInfo
	const media: MediaBase = {
		id: data.details.id,
		title: data.details.title,
		overview: data.details.overview,
		poster_path: data.details.poster_path,
		backdrop_path: data.details.backdrop_path,
		releaseDate: data.releaseDate,
		genres: data.details.genres.map((g) => ({ id: g.id, name: g.name })),
		tagline: data.details.tagline,
		crew: groupedCrew,
		runtime: data.details.runtime,
		certification: data.certification,
		mediaType: 'movie'
	}

	return (
		<>
			<Header />

			<div className="movie-page flex-column">
				<MediaInfo media={media} />

				<div className="movie-column-wrapper flex">
					<div className="movie-column-left flex-column gap-30">
						{top10Cast.length > 0 && <MovieCast cast={top10Cast} mediaType={media.mediaType} />}
						<MovieReviewBlock
							movieDetails={data.details}
							allReviews={data.reviews}
							randomReview={randomReview}
						/>
						<MediaBlock media={data.media} />
						{data.similar.length > 0 && <SimilarMedia items={data.similar} type="movie" />}
					</div>

					<MediaSidebar details={data.details} external={data.external} keywords={data.keywords} />
				</div>
			</div>

			<Footer />
		</>
	)
}

export default MoviePage
