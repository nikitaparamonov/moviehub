import React, { useState, FormEvent } from 'react'
import './css/SearchBanner.css'
import { useNavigate } from 'react-router-dom'

const SearchBanner: React.FC = () => {
	const [query, setQuery] = useState('')
	const navigate = useNavigate()

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (!query.trim()) return

		navigate(`/search?query=${encodeURIComponent(query)}`)
	}

	return (
		<div className="search-banner">
			<div className="overlay">
				<h1 className="search-title">Welcome to MovieHub</h1>
				<p className="search-subtitle">Explore movies, TV shows and stars</p>
				<form onSubmit={handleSubmit} className="search-form">
					<input
						type="text"
						placeholder="Search for a movie, TV show, or person"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="search-input"
					/>
					<button type="submit" className="search-button">
						Search
					</button>
				</form>
			</div>
		</div>
	)
}

export default SearchBanner
