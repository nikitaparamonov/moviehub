import React from 'react'
import { Genre, Certification, Language, MoviesFilterForm } from '../../api/tmdb'
import DateRangeFilter from '../ui/DateRangeFilter'
import { LanguageSelect } from '../ui/LanguageSelect'
import '../css/FilterPanel.css'

interface MovieFiltersProps {
	form: MoviesFilterForm
	setForm: React.Dispatch<React.SetStateAction<MoviesFilterForm>>
	genres: Genre[]
	certifications: Certification[]
	languages: Language[]
	loading: boolean
	onSearch: (e: React.FormEvent) => void
}

export const MovieFilters: React.FC<MovieFiltersProps> = ({
	form,
	setForm,
	genres,
	certifications,
	languages,
	loading,
	onSearch,
}) => {
	const toggleGenre = (id: number) => {
		setForm((prev) => ({
			...prev,
			genres: prev.genres.includes(id) ? prev.genres.filter((g) => g !== id) : [...prev.genres, id],
		}))
	}

	const toggleCertification = (cert: string) => {
		setForm((prev) => {
			const current = prev.certifications || []
			const isActive = current.includes(cert)
			return {
				...prev,
				certifications: isActive ? current.filter((c) => c !== cert) : [...current, cert],
			}
		})
	}

	return (
		<form className="filter-panel" onSubmit={onSearch}>
			<div className="filter-panel-title">
				<h2>Filters</h2>
			</div>

			{/* Show Me */}
			<div className="filter-panel-item">
				<h3>Show Me</h3>
				<div className="filter-panel-field flex-column">
					{['everything', 'unwatched', 'watched'].map((option) => (
						<div key={option} className="center">
							<input
								id={`show-me-${option}`}
								className="radio"
								type="radio"
								name="show-me"
								value={option}
								checked={form.showMe === option}
								onChange={() =>
									setForm((prev) => ({ ...prev, showMe: option as MoviesFilterForm['showMe'] }))
								}
							/>
							<label htmlFor={`show-me-${option}`} className="radio-label">
								{option === 'everything'
									? 'Everything'
									: option === 'unwatched'
										? "Movies I Haven't Seen"
										: 'Movies I Have Seen'}
							</label>
						</div>
					))}
				</div>
			</div>

			{/* Release Dates */}
			<div className="filter-panel-item">
				<h3>Release Dates</h3>
				<DateRangeFilter
					from={form.from}
					to={form.to}
					onChange={(range) => setForm((prev) => ({ ...prev, ...range }))}
				/>
			</div>

			{/* Genres */}
			<div className="filter-panel-item">
				<h3>Genres</h3>
				<ul className="list flex flex-wrap">
					{genres.map((genre) => {
						const isActive = form.genres.includes(genre.id)
						return (
							<li key={genre.id} className="list-item">
								<button
									type="button"
									className={`reset-btn ${isActive ? 'active' : ''}`}
									aria-pressed={isActive}
									onClick={() => toggleGenre(genre.id)}
								>
									{genre.name}
								</button>
							</li>
						)
					})}
				</ul>
			</div>

			{/* Certification */}
			<div className="filter-panel-item">
				<h3>Certification</h3>
				<ul className="list flex flex-wrap">
					{certifications.map((cert) => {
						const isActive = form.certifications.includes(cert.certification)
						return (
							<li key={cert.certification} className="list-item">
								<button
									type="button"
									className={`reset-btn ${isActive ? 'active' : ''}`}
									aria-pressed={isActive}
									onClick={() => toggleCertification(cert.certification)}
								>
									{cert.certification}
								</button>
							</li>
						)
					})}
				</ul>
			</div>

			{/* Language */}
			<div className="filter-panel-item">
				<h3>Language</h3>
				<LanguageSelect
					languages={languages}
					value={form.language}
					onChange={(language) => setForm((prev) => ({ ...prev, language }))}
				/>
			</div>

			{/* Search button */}
			<div className="filter-panel-item">
				<button type="submit" className="search-btn" disabled={loading}>
					{loading ? 'Searching...' : 'Search'}
				</button>
			</div>
		</form>
	)
}
