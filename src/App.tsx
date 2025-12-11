import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SearchPage from './pages/SearchPage'
import PersonPage from './pages/PersonPage'
import MoviePage from './pages/MoviePage'
import TVPage from './pages/TVPage'
import AllReviewsPage from './pages/AllReviewsPage'
import FullReviewPage from './pages/FullReviewPage'
import FullCastPage from './pages/FullCastPage'

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/search" element={<SearchPage />} />
				<Route path="/person/:id" element={<PersonPage />} />
				<Route path="/movie/:id" element={<MoviePage />} />
				<Route path="/tv/:id" element={<TVPage />} />
				<Route path="/movie/:movieId/reviews" element={<AllReviewsPage />} />
				<Route path="/review/:reviewId" element={<FullReviewPage />} />
				<Route path="/:mediaType/:mediaId/cast" element={<FullCastPage />} />
			</Routes>
		</Router>
	)
}

export default App
