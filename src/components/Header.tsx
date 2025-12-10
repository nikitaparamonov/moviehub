import React from 'react'
import './css/Header.css'
import logo from './icons/movie-hub-logo.svg'

const Header: React.FC = () => {
	return (
		<header className="header center">
			<div className="header-container flex-row justify-between">
				<div className="header-logo-container">
					<a href="/" className="flex-row">
						<img src={logo} alt="MovieHub Logo" className="header-logo-image" />
						<span className="header-logo-text">MovieHub</span>
					</a>
				</div>
				<nav className="nav">
					<a href="/movies">Movies</a>
					<a href="/series">Series</a>
				</nav>
			</div>
		</header>
	)
}

export default Header
