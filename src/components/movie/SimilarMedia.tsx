import type { MediaSummary } from '../../api/tmdb'
import { Link } from 'react-router-dom'
import { ReactComponent as NoImageIcon } from '../icons/NoImageIcon.svg'

interface Props<T extends 'movie' | 'tv'> {
	items: MediaSummary<T>[]
	type: T
}

const SimilarMedia = <T extends 'movie' | 'tv'>({ items, type }: Props<T>) => {
	return (
		<section className="content-block">
			<h3>Recommendations</h3>
			<div className="horizontal-scroll-container">
				{items.map((item) => {
					// unify title and route
					const title = 'title' in item ? item.title : item.name
					const route = type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`
					const posterPath = item.poster_path

					return (
						<Link to={route} key={item.id} className="card card-medium">
							<div className="similar-card-img-wrapper">
								{posterPath ? (
									<img src={`https://image.tmdb.org/t/p/w300${posterPath}`} alt={title} />
								) : (
									<NoImageIcon className="img-placeholder" />
								)}
							</div>
							<p className="similar-card-title">{title}</p>
						</Link>
					)
				})}
			</div>
		</section>
	)
}

export default SimilarMedia
