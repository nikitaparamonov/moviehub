import React from 'react'
import SocialLinks from './SocialLinks'
import { getLanguageName } from '../../utils/lang'
import { ExternalIDsResponse, Keyword, MovieDetails, TVDetails } from '../../api/tmdb'
import { ImageWithFallback } from '../ui/ImageWithFallback'

interface MediaSidebarProps {
	details: MovieDetails | TVDetails
	external: ExternalIDsResponse
	keywords: Keyword[]
}

const isMovie = (d: MovieDetails | TVDetails): d is MovieDetails => 'budget' in d

const MediaSidebar: React.FC<MediaSidebarProps> = ({ details, external, keywords }) => {
	return (
		<div className="movie-sidebar flex-column flex-wrap gap-20">
			{/* Social Links */}
			<section className="movie-social-links" aria-labelledby="social-links-heading">
				<SocialLinks
					imdb_id={external?.imdb_id}
					wikidata_id={external?.wikidata_id}
					facebook_id={external?.facebook_id}
					instagram_id={external?.instagram_id}
					twitter_id={external?.twitter_id}
					homepage={details.homepage}
				/>
			</section>

			{/* Release info */}
			<section className="movie-release-info" aria-labelledby="release-info-heading">
				<h4 id="release-info-heading" className="sr-only">
					Release Information
				</h4>
				{isMovie(details) ? (
					<>
						<p>
							<strong>Status:</strong> {details.status}
						</p>
						<p>
							<strong>Original Language:</strong> {getLanguageName(details.original_language)}
						</p>
						<p>
							<strong>Budget:</strong> ${details.budget?.toLocaleString() ?? 0}
						</p>
						<p>
							<strong>Revenue:</strong> ${details.revenue?.toLocaleString() ?? 0}
						</p>
					</>
				) : (
					<>
						<p>
							<strong>Status:</strong> {details.status}
						</p>
						<p>
							<strong>Network:</strong>{' '}
							<ImageWithFallback
								src={
									details.networks?.[0]?.logo_path
										? `https://media.themoviedb.org/t/p/h30${details.networks[0].logo_path}`
										: null
								}
								alt={
									details.networks?.[0]?.name ? `${details.networks[0].name} logo` : 'No network logo'
								}
								className="media-network-logo"
								type="poster"
							/>
						</p>
						<p>
							<strong>Type:</strong> {details.type}
						</p>
						<p>
							<strong>Original Language:</strong> {getLanguageName(details.original_language)}
						</p>
					</>
				)}
			</section>

			{/* Keywords */}
			<section className="movie-keywords" aria-labelledby="keywords-heading">
				<h4 id="keywords-heading" className="sr-only">
					Keywords
				</h4>
				{keywords.map((k) => (
					<button key={k.id} className="keyword-btn" aria-label={`Keyword: ${k.name}`}>
						{k.name}
					</button>
				))}
			</section>
		</div>
	)
}

export default React.memo(MediaSidebar)
