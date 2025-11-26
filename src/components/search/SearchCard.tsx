import React from 'react'
import { Link } from 'react-router-dom'
import './../css/Search.css'
import { SearchResult, MovieTV, Movie, TV, Person } from '../../api/tmdb'
import NoImageIcon from '../icons/NoImageIcon.svg'
import { formatDate } from '../../utils/date'

const IMG = 'https://image.tmdb.org/t/p/w300'

interface Props {
  item: SearchResult
}

// These help TypeScript narrow down the type of item based on media_type
const isPerson = (item: SearchResult): item is Person => item.media_type === 'person'
const isMovie = (item: MovieTV): item is Movie => item.media_type === 'movie'
const isTV = (item: MovieTV): item is TV => item.media_type === 'tv'
const isMovieTV = (item: SearchResult): item is MovieTV => item.media_type === 'movie' || item.media_type === 'tv'

// Helper function to get the correct image
const getImage = (item: SearchResult): string => {
  if (isPerson(item)) return item.profile_path ? IMG + item.profile_path : NoImageIcon
  if (isMovie(item) || isTV(item)) return item.poster_path ? IMG + item.poster_path : NoImageIcon
  return NoImageIcon
}

// Helper function to get the display title
const getTitle = (item: MovieTV | Person): string => {
  if (isPerson(item) || isTV(item)) return item.name
  if (isMovie(item)) return item.title
  return 'Untitled'
}

const getReleaseDate = (item: MovieTV): string | undefined => {
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
      {/* apply svg-img class if using fallback SVG */}
      <img
        className={`search-card-img ${img === NoImageIcon ? 'svg-img' : ''}`}
        src={img}
        alt={title}
      />

      <div>
        {/* Person */}
        {isPerson(item) && (
          <>
            <h3>{item.name}</h3>
            <p>{item.known_for_department}</p>
            {item.known_for && item.known_for.length > 0 && (
              <ul>
                {item.known_for.map((work) => (
                  <li key={work.id}>
                    <b>{isMovie(work) ? work.title : work.name}</b> ({formatDate(getReleaseDate(work)!)})
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Movie / TV */}
        {(isMovieTV(item)) && (
          <>
            <h3 style={{ marginBottom: 0 }}>{getTitle(item)}</h3>
            {getReleaseDate(item) && <p style={{ marginTop: 0 }}>{formatDate(getReleaseDate(item)!)}</p>}
            <p>{item.overview || 'No description available.'}</p>
          </>
        )}
      </div>
    </div>
  )

  // Wrap in Link if link exists
  return link ? <Link to={link} className="search-card-link">{content}</Link> : content
}

export default SearchCard
