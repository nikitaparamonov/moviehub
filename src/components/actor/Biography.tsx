import { useState } from 'react'
import type { PersonDetails } from '../../api/tmdb'

interface BiographyProps {
	person: PersonDetails
}

const Biography: React.FC<BiographyProps> = ({ person }) => {
	const BIO_LIMIT = 850
	const [showFullBio, setShowFullBio] = useState(false)

	return (
		<>
			{person.biography && (
				<section className="biography">
					<h3 className="biography-title">Biography</h3>
					<div className="biography-text">
						{showFullBio || person.biography.length <= BIO_LIMIT
							? person.biography.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
							: (() => {
									const shortText = person.biography.slice(0, BIO_LIMIT)
									const paras = shortText.split('\n\n')
									const lastParaIndex = paras.length - 1
									paras[lastParaIndex] = paras[lastParaIndex] + '...'
									return paras.map((para, i) => <p key={i}>{para}</p>)
							  })()}

						{!showFullBio && person.biography.length > BIO_LIMIT && (
							<button className="biography-readmore" onClick={() => setShowFullBio(true)}>
								Read more
							</button>
						)}
					</div>
				</section>
			)}
		</>
	)
}

export default Biography
