import React from 'react'
import './../css/Search.css'

interface Props {
	page: number
	totalPages: number
	onChange: (p: number) => void
}

const Pagination: React.FC<Props> = ({ page, totalPages, onChange }) => {
	return (
		<div className="pagination">
			<button onClick={() => onChange(page - 1)} disabled={page <= 1}>
				Prev
			</button>

			<span>
				Page {page} of {totalPages}
			</span>

			<button onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
				Next
			</button>
		</div>
	)
}

export default Pagination
