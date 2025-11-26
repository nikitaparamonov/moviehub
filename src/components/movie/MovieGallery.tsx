import React from 'react'
import type { Image } from '../../api/tmdb'

interface MovieGalleryProps {
	images: Image[]
}

const MovieGallery: React.FC<MovieGalleryProps> = ({ images }) => {
	return (
		<section className="movie-gallery">
			<h3>Gallery</h3>
			<div className="gallery-grid">
				{images.map((img, i) => (
					<img key={i} src={`https://image.tmdb.org/t/p/w300${img.file_path}`} alt="Movie still" />
				))}
			</div>
		</section>
	)
}

export default MovieGallery
