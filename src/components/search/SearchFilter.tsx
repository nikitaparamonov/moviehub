import React from 'react'
import './../css/Search.css'

export type FilterType = 'all' | 'movie' | 'tv' | 'person'

interface Props {
	active: FilterType
	onChange: (value: FilterType) => void
}

const tabs: { label: string; value: FilterType }[] = [
	{ label: 'All', value: 'all' },
	{ label: 'Movies', value: 'movie' },
	{ label: 'TV Shows', value: 'tv' },
	{ label: 'People', value: 'person' }
]

const SearchFilter: React.FC<Props> = ({ active, onChange }) => {
	return (
		<aside className="search-sidebar">
			<h3>Search Results</h3>

			<nav>
				{tabs.map(t => (
					<button
						key={t.value}
						className={`search-filter-btn ${active === t.value ? 'active' : ''}`}
						onClick={() => onChange(t.value)}
					>
						{t.label}
					</button>
				))}
			</nav>
		</aside>
	)
}

export default SearchFilter
