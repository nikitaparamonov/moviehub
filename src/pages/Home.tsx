import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { fetchPopularMovies, MovieDetails } from '../api/tmdb'
import SearchBanner from '../components/main/SearchBanner'
import TrendingMovies from '../components/main/TrendingMovies'
import '../components/css/HomePage.css'

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
			<main className='flex-column center'>
				<SearchBanner />
				<div className='main-content-wrapper'>
					<TrendingMovies title="Trending" movies={popularMovies} />
				</div>	
			</main>
			<Footer />
		</div>
	)
}

export default Home
