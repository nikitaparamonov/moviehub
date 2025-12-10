import React from 'react'
import { Link } from 'react-router-dom'
import './../css/Search.css'
import { SearchResult, MovieDetails, TVDetails, Person } from '../../api/tmdb'
import NoImageIcon from '../icons/NoImageIcon.svg'
import { formatDate } from '../../utils/date'

const IMG = 'https://image.tmdb.org/t/p/w300'

interface Props {
	item: SearchResult
}

// Type guards
const isPerson = (item: SearchResult): item is Person => item.media_type === 'person'
const isMovie = (item: SearchResult): item is MovieDetails & { media_type: 'movie' } =>
	(item as any).media_type === 'movie'
const isTV = (item: SearchResult): item is TVDetails & { media_type: 'tv' } => (item as any).media_type === 'tv'

const isMovieTV = (
	item: SearchResult,
): item is (MovieDetails & { media_type: 'movie' }) | (TVDetails & { media_type: 'tv' }) => isMovie(item) || isTV(item)

// Helper functions
const getImage = (item: SearchResult): string => {
	if (isPerson(item)) return item.profile_path ? IMG + item.profile_path : NoImageIcon
	if (isMovie(item) || isTV(item)) return item.poster_path ? IMG + item.poster_path : NoImageIcon
	return NoImageIcon
}

const getTitle = (item: SearchResult): string => {
	if (isPerson(item)) return item.name
	if (isMovie(item)) return item.title
	if (isTV(item)) return item.name
	return 'Untitled'
}

const getReleaseDate = (item: SearchResult): string | undefined => {
	if (isMovie(item)) return item.release_date
	if (isTV(item)) return item.first_air_date
	return undefined
}

const getLink = (item: SearchResult): string | undefined => {
	if (isPerson(item)) return `/person/${item.id}`
	if (isMovie(item)) return `/movie/${item.id}`
	if (isTV(item)) return `/tv/${item.id}`
	return undefined
}

const SearchCard: React.FC<Props> = ({ item }) => {
	const img = getImage(item)
	const title = getTitle(item)
	const link = getLink(item)

	const content = (
		<div className="search-card">
			<img className={`search-card-img ${img === NoImageIcon ? 'svg-img' : ''}`} src={img} alt={title} />

			<div>
				{/* Person */}
				{isPerson(item) && (
					<>
						<h3>{item.name}</h3>
						<p>{item.known_for_department}</p>
						{(item.known_for ?? []).length > 0 && (
							<ul>
								{(item.known_for ?? []).map((work) => {
									const workTitle =
										(work as MovieDetails & { media_type: 'movie' }).title ||
										(work as TVDetails & { media_type: 'tv' }).name
									const workDate =
										(work as MovieDetails & { media_type: 'movie' }).release_date ||
										(work as TVDetails & { media_type: 'tv' }).first_air_date
									return (
										<li key={work.id}>
											<b>{workTitle}</b> ({workDate ? formatDate(workDate) : 'Unknown'})
										</li>
									)
								})}
							</ul>
						)}
					</>
				)}

				{/* Movie / TV */}
				{isMovieTV(item) && (
					<>
						<h3 style={{ marginBottom: 0 }}>{getTitle(item)}</h3>
						{getReleaseDate(item) && <p style={{ marginTop: 0 }}>{formatDate(getReleaseDate(item)!)}</p>}
						<p>{item.overview ?? 'No description available.'}</p>
					</>
				)}
			</div>
		</div>
	)

	return link ? (
		<Link to={link} className="search-card-link">
			{content}
		</Link>
	) : (
		content
	)
}

export default SearchCard
