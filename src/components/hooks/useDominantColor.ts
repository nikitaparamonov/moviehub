import { useState, useEffect } from 'react'
import ColorThief from 'color-thief-browser'

export function useDominantColor(imageUrl: string, fallback: string = 'gray') {
	const [color, setColor] = useState(fallback)

	useEffect(() => {
		if (!imageUrl) return

		// Create a new HTMLImageElement
		const img = new Image()
		img.crossOrigin = 'anonymous' // Enable CORS to allow color extraction from remote images
		img.src = imageUrl

		// Once the image is loaded, extract the dominant color
		img.onload = () => {
			try {
				const thief = new ColorThief()
				// getColor returns the dominant color as [R, G, B]
				const [r, g, b] = thief.getColor(img, 10) // Quality parameter = 10 for faster processing
				setColor(`${r}, ${g}, ${b}`)
			} catch {
				// Fallback color if extraction fails
				setColor(fallback)
			}
		}

		img.onerror = () => setColor(fallback)
	}, [imageUrl, fallback])

	return color
}
