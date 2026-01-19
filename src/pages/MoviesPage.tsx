import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import {
	Certification,
	fetchMovieCertifications,
	fetchMovieGenres,
	fetchPopularMovies,
	Genre,
	MovieDetails,
} from '../api/tmdb'
import '../components/css/MoviesPage.css'
import '../components/css/FilterPanel.css'
import { formatDateShort } from '../utils/date'
import { Link } from 'react-router-dom'
import { ImageWithFallback } from '../components/ui/ImageWithFallback'
import DateRangeFilter from '../components/ui/DateRangeFilter'

const MoviesPage: React.FC = () => {
	const [popularMovies, setPopularMovies] = useState<MovieDetails[]>([])
	const [genres, setGenres] = useState<Genre[]>([])
	const [certifications, setCertifications] = useState<Certification[]>([])
	const [, setLoadingPopular] = useState(true)
	const [filters, setFilters] = useState({
		from: '',
		to: '',
	})

	// Fetch movies, genres and certifications when component mounts
	useEffect(() => {
		const fetchData = async () => {
			setLoadingPopular(true)
			try {
				const [movies, genres, certifications] = await Promise.all([
					fetchPopularMovies(),
					fetchMovieGenres(),
					fetchMovieCertifications(),
				])

				setPopularMovies(movies)
				setGenres(genres)
				setCertifications(certifications)
			} catch (error) {
				console.error('Failed to fetch movies or genres:', error)
			} finally {
				setLoadingPopular(false)
			}
		}

		fetchData()
	}, [])

	return (
		<>
			<Header />
			<section className="inner-content center">
				<div className="content-wrapper flex-column">
					<div className="title">
						<h2>Popular Movies</h2>
					</div>
					<div className="content flex-row">
						<div className="filter-panel">
							<div className="filter-panel-title">
								<h2>Filters</h2>
							</div>
							<div className="filter-panel-item">
								<h3>Show Me</h3>
								<div className="filter-panel-field">
									<input
										id="show-me-everything"
										className="radio"
										type="radio"
										name="show-me"
										value="everything"
									></input>
									<label htmlFor="show-me-everything" className="radio-label">
										Everything
									</label>
								</div>
								<div className="filter-panel-field">
									<input
										id="show-me-not-seen"
										className="radio"
										type="radio"
										name="show-me"
										value="unwatched"
									></input>
									<label htmlFor="show-me-not-seen" className="radio-label">
										Movies I Haven't Seen
									</label>
								</div>
								<div className="filter-panel-field">
									<input
										id="show-me-seen"
										className="radio"
										type="radio"
										name="show-me"
										value="watched"
									></input>
									<label htmlFor="show-me-seen" className="radio-label">
										Movies I Have Seen
									</label>
								</div>
							</div>

							<div className="filter-panel-item">
								<h3>Release Dates</h3>
								<DateRangeFilter
									from={filters.from}
									to={filters.to}
									onChange={(range) => setFilters((prev) => ({ ...prev, ...range }))}
								/>
							</div>

							<div className="filter-panel-item">
								<h3>Genres</h3>
								<ul className="list flex flex-wrap">
									{genres.map((genre) => (
										<li key={genre.id} className="list-item">
											{genre.name}
										</li>
									))}
								</ul>
							</div>

							<div className="filter-panel-item">
								<h3>Certification</h3>
								<ul className="list flex flex-wrap">
									{certifications.map((cert) => (
										<li key={cert.certification} className="list-item">
											{cert.certification}
										</li>
									))}
								</ul>
							</div>
						</div>
						<section className="content-items">
							<div className="items-wrapper">
								{popularMovies.map((movie) => {
									const poster = movie.poster_path
										? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
										: null

									return (
										<Link to={`/movie/${movie.id}`} className="movie-card" key={movie.id}>
											<div className="movie-card-poster">
												<ImageWithFallback
													src={poster}
													alt={movie.title || 'Image'}
													type="poster"
												/>
											</div>
											<div className="movie-card-title">
												<h2>{movie.title}</h2>
												<p>{formatDateShort(movie.release_date)}</p>
											</div>
										</Link>
									)
								})}
							</div>
						</section>
					</div>
				</div>
			</section>
			<Footer />
		</>
	)
}

export default MoviesPage
