import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { fetchPopularMovies, Movie } from '../api/tmdb'
import MovieList from '../components/MovieList'
import SearchBanner from '../components/SearchBanner'

const Home: React.FC = () => {
	const [popularMovies, setPopularMovies] = useState<Movie[] | null>(null)
	const [loadingPopular, setLoadingPopular] = useState(true)

	// Fetch popular movies on mount
	useEffect(() => {
		const getMovies = async () => {
			try {
				const data = await fetchPopularMovies()
				setPopularMovies(data)
			} catch (error) {
				console.error('Failed to fetch movies:', error)
				setPopularMovies([])
			} finally {
				setLoadingPopular(false)
			}
		}
		getMovies()
	}, [])

	return (
		<div className="home-page">
			<Header />
			<main style={{ backgroundColor: '#032541', minHeight: '80vh' }}>
				<SearchBanner />
				<MovieList title="Trending" movies={popularMovies} loading={loadingPopular} />
			</main>
			<Footer />
		</div>
	)
}

export default Home
