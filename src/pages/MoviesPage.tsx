import { useCallback, useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import {
	Certification,
	fetchDiscoverMovies,
	fetchLanguages,
	fetchMovieCertifications,
	fetchMovieGenres,
	Genre,
	Language,
	MovieDetails,
	MoviesFilterForm,
} from '../api/tmdb'
import '../components/css/MoviesPage.css'
import { formatDateShort } from '../utils/date'
import { Link, useSearchParams } from 'react-router-dom'
import { ImageWithFallback } from '../components/ui/ImageWithFallback'
import { MovieFilters } from '../components/movies-page/MovieFilters'

const MoviesPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [popularMovies, setPopularMovies] = useState<MovieDetails[]>([])
	const [genres, setGenres] = useState<Genre[]>([])
	const [certifications, setCertifications] = useState<Certification[]>([])
	const [languages, setLanguages] = useState<Language[]>([])
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [form, setForm] = useState<MoviesFilterForm>({
		showMe: 'everything',
		language: null,
		genres: [],
		certifications: [],
		from: '',
		to: '',
	})

	const sentinelRef = useRef<HTMLDivElement | null>(null)

	// ==========================
	// Helper functions
	// ==========================
	const fetchMoviesPage = async (form: MoviesFilterForm, pageToLoad: number = 1, append: boolean = false) => {
		setLoading(true)
		setError(null)

		try {
			const data = await fetchDiscoverMovies(form, pageToLoad)
			setPopularMovies((prev) => (append ? [...prev, ...data.results] : data.results))
			setPage(data.page)
			setTotalPages(data.total_pages)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}

	// ==========================
	// Handlers
	// ==========================

	// handleSearch resets the movies list and triggers a new search based on the current form.
	// It also scrolls the page to top and updates the URL search params.
	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault()

		// Reset movies and pagination
		setPopularMovies([])
		setPage(1)
		setTotalPages(1)

		// Scroll to top
		window.scrollTo({ top: 0, behavior: 'smooth' })

		// Fetch first page
		await fetchMoviesPage(form, 1, false)

		// Update URL search params (only on search, not on every change)
		setSearchParams({
			language: form.language || '',
			genres: form.genres.join(','),
			certifications: form.certifications.join(','),
			from: form.from,
			to: form.to,
			showMe: form.showMe,
		})
	}

	// loadMovies is memoized with useCallback to avoid unnecessary re-creation on each render.
	// This ensures the IntersectionObserver does not subscribe to a new function every time.
	const loadMovies = useCallback(
		async (pageToLoad: number) => {
			if (pageToLoad > totalPages) return
			await fetchMoviesPage(form, pageToLoad, true)
		},
		[form, totalPages],
	)

	// ==========================
	// useEffects
	// ==========================

	// First effect: fetch initial genres, certifications, languages and the first page of movies.
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			setError(null)

			try {
				const [genres, certifications, languages] = await Promise.all([
					fetchMovieGenres(),
					fetchMovieCertifications(),
					fetchLanguages(),
				])

				setGenres(genres)
				setCertifications(certifications)
				setLanguages(languages)

				const data = await fetchDiscoverMovies({
					showMe: 'everything',
					language: null,
					genres: [],
					certifications: [],
					from: '',
					to: '',
				})

				setPopularMovies(data.results)
			} catch (err) {
				console.error('Failed to fetch initial data:', err)
				setError(err instanceof Error ? err.message : 'Unknown error')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	// Second effect: synchronize form state with URL search params when the page loads or params change.
	// Important: this only runs on mount or when searchParams change; it does not update the URL itself.
	useEffect(() => {
		const params = Object.fromEntries([...searchParams])
		setForm((prev) => ({
			...prev,
			language: params.language || null,
			genres: params.genres ? params.genres.split(',').map(Number) : [],
			certifications: params.certifications ? params.certifications.split(',').map(String) : [],
			from: params.from || '',
			to: params.to || '',
			showMe: (params.showMe as 'everything' | 'watched' | 'unwatched') || 'everything',
		}))
	}, [searchParams])

	// Third effect: infinite scroll via IntersectionObserver
	// Note: use a local variable (currentSentinel) for cleanup to avoid React ref warning
	// The observer triggers loadMovies for the next page when the sentinel becomes visible.
	useEffect(() => {
		if (!sentinelRef.current) return

		const currentSentinel = sentinelRef.current

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]
				if (entry.isIntersecting && !loading && page < totalPages) {
					loadMovies(page + 1)
				}
			},
			{ root: null, rootMargin: '200px', threshold: 1.0 },
		)

		observer.observe(sentinelRef.current)

		return () => {
			if (currentSentinel) observer.unobserve(currentSentinel)
		}
	}, [page, totalPages, loading, loadMovies])

	return (
		<>
			<Header />
			<section className="inner-content center">
				<div className="content-wrapper flex-column">
					<div className="title">
						<h2>Popular Movies</h2>
					</div>
					<div className="content flex-row">
						<MovieFilters
							form={form}
							setForm={setForm}
							genres={genres}
							certifications={certifications}
							languages={languages}
							loading={loading}
							onSearch={handleSearch}
						/>

						<section className="content-items">
							{loading && <div className="loader">Loading movies...</div>}
							{error && <div className="error">{error}</div>}

							<div className="items-wrapper">
								{!loading &&
									!error &&
									popularMovies.map((movie) => {
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

								{/* Sentinel element triggers loading more */}
								<div ref={sentinelRef} style={{ height: '1px' }}></div>
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
