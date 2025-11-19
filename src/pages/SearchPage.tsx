import React, { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchSearchMulti, SearchResult } from '../api/tmdb'

import PageContainer from '../components/layout/PageContainer'
import SearchFilter, { FilterType } from '../components/search/SearchFilter'
import SearchCard from '../components/search/SearchCard'
import Pagination from '../components/search/Pagination'
import '../components/css/Search.css'

const LOCAL_PAGE_SIZE = 10 // Items per page for filtered results

const SearchPage: React.FC = () => {
	const loc = useLocation()
	const params = new URLSearchParams(loc.search)
	const query = params.get('query') || ''

	const [results, setResults] = useState<SearchResult[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [filter, setFilter] = useState<FilterType>('all')
	const [localPage, setLocalPage] = useState(1)

	// Reset local page when query or filter changes
	useEffect(() => {
		setLocalPage(1)
	}, [query, filter])

	// Fetch all results from API
	useEffect(() => {
		const load = async () => {
			setLoading(true)
			setError(null)
			try {
				if (!query.trim()) {
					setResults([])
					return
				}
				const data = await fetchSearchMulti(query, 1) // always fetch first page
				setResults(data.results)
			} catch (err) {
				console.error(err)
				setResults([])
				setError('Failed to fetch search results.')
			} finally {
				setLoading(false)
			}
		}

		load()
	}, [query])

	// Filtered results based on selected filter
	const filteredResults = useMemo(
		() => (filter === 'all' ? results : results.filter((item) => item.media_type === filter)),
		[results, filter],
	)

	// Compute total pages for local pagination
	const filteredTotalPages = useMemo(() => Math.ceil(filteredResults.length / LOCAL_PAGE_SIZE), [filteredResults])

	// Slice filtered results for current local page
	const pagedResults = useMemo(() => {
		const start = (localPage - 1) * LOCAL_PAGE_SIZE
		return filteredResults.slice(start, start + LOCAL_PAGE_SIZE)
	}, [filteredResults, localPage])

	return (
		<PageContainer>
			<SearchFilter active={filter} onChange={setFilter} />

			<main className="search-main">
				<h2>
					Results for: <span className="highlight">{query}</span>
				</h2>

				{loading ? (
					<p className="loading-text">Loading...</p>
				) : error ? (
					<p className="error-text">{error}</p>
				) : pagedResults.length === 0 ? (
					<p className="no-results-text">No results found.</p>
				) : (
					<div className="search-results" aria-live="polite">
						{pagedResults.map((item) => (
							<SearchCard key={`${item.media_type}-${item.id}`} item={item} />
						))}
					</div>
				)}

				{!loading && filteredTotalPages > 1 && (
					<Pagination page={localPage} totalPages={filteredTotalPages} onChange={setLocalPage} />
				)}
			</main>
		</PageContainer>
	)
}

export default SearchPage
