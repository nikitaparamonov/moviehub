import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SearchPage from './pages/SearchPage'
import PersonPage from './pages/PersonPage'
import MoviePage from './pages/MoviePage'
import AllReviewsPage from './pages/AllReviewsPage'
import FullReviewPage from './pages/FullReviewPage'

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/search" element={<SearchPage />} />
				<Route path="/person/:id" element={<PersonPage />} />
				<Route path="/movie/:id" element={<MoviePage type="movie" />} />
				<Route path="/tv/:id" element={<MoviePage type="tv" />} />
				<Route path="/movie/:id/reviews" element={<AllReviewsPage />} />
				<Route path="/review/:reviewId" element={<FullReviewPage />} />
			</Routes>
		</Router>
	)
}

export default App
