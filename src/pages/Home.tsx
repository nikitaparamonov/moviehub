import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { fetchPopularMovies, MovieDetails } from '../api/tmdb'
import SearchBanner from '../components/main/SearchBanner'
import TrendingMovies from '../components/main/TrendingMovies'
import '../components/css/home/HomePage.css'
import LatestTrailers from '../components/main/LatestTrailers'

const Home: React.FC = () => {
	const [popularMovies, setPopularMovies] = useState<MovieDetails[]>()
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
		<div className="home-page flex-column">
			<Header />
			<main className='main flex-column center'>
				{/* huge banner for search movies and persons */}
				<SearchBanner />

				{/* popular movies */}
				<TrendingMovies movies={popularMovies} />

				{/* latest trailers */}
				<LatestTrailers />
			</main>
			<Footer />
		</div>
	)
}

export default Home
