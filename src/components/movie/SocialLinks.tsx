import React from 'react'
import { ReactComponent as IMDbIcon } from '../icons/imdb.svg'
import { ReactComponent as FacebookIcon } from '../icons/facebook.svg'
import { ReactComponent as InstagramIcon } from '../icons/instagram.svg'
import { ReactComponent as TwitterIcon } from '../icons/twitter.svg'
import { ReactComponent as WikiIcon } from '../icons/wiki.svg'
import { ReactComponent as HomepageIcon } from '../icons/homepage-link.svg'

interface SocialLinksProps {
	imdb_id?: string | null
	wikidata_id?: string | null
	facebook_id?: string | null
	instagram_id?: string | null
	twitter_id?: string | null
    homepage?: string | null
}

const SocialLinks: React.FC<SocialLinksProps> = ({ imdb_id, wikidata_id, facebook_id, instagram_id, twitter_id, homepage }) => {
	const links = [
		imdb_id && { Icon: IMDbIcon, label: 'IMDb', url: `https://www.imdb.com/title/${imdb_id}` },
		wikidata_id && { Icon: WikiIcon, label: 'Wikidata', url: `https://www.wikidata.org/wiki/${wikidata_id}` },
		facebook_id && { Icon: FacebookIcon, label: 'Facebook', url: `https://facebook.com/${facebook_id}` },
		instagram_id && { Icon: InstagramIcon, label: 'Instagram', url: `https://instagram.com/${instagram_id}` },
		twitter_id && { Icon: TwitterIcon, label: 'Twitter', url: `https://twitter.com/${twitter_id}` },
        homepage && { Icon: HomepageIcon, label: 'Homepage', url: `${homepage}` },
	].filter(Boolean)

	if (links.length === 0) return null

	return (
		<div className="content-block social-links">
			<h3>Social Links</h3>
			<ul className='flex-list flex-wrap gap-10'>
				{links.map((link: any) => (
					<li key={link.url}>
						<a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
							<link.Icon width={30} height={30} />
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}

export default SocialLinks
