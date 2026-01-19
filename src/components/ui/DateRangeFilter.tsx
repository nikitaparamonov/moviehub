import React from 'react'
import '../css/DateRangeFilter.css'

type Props = {
	from?: string
	to?: string
	onChange: (range: { from?: string; to?: string }) => void
}

const DateRangeFilter: React.FC<Props> = ({ from, to, onChange }) => {
	const handleChange = (field: 'from' | 'to') => (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ [field]: e.target.value })
	}

	return (
		<div className="date-range-column flex-column">
			<div className="date-input-wrapper flex-row">
                <span>from</span>
				<input type="date" value={from || ''} onChange={handleChange('from')} placeholder="From" />
			</div>

			<div className="date-input-wrapper flex-row">
                <span>to</span>
				<input type="date" value={to || ''} onChange={handleChange('to')} placeholder="To" />
			</div>
		</div>
	)
}

export default DateRangeFilter
