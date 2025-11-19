import React from 'react'
import './css/Header.css'

const Header: React.FC = () => {
	return (
		<header className="header">
			<div className="logo">MovieHub</div>
			<nav className="nav">
				<a href="/">Home</a>
				<a href="/movies">Movies</a>
				<a href="/series">Series</a>
			</nav>
		</header>
	)
}

export default Header
