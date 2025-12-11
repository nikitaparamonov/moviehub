import { useState, useCallback } from 'react'
import { ReactComponent as NoImageIcon } from '../icons/NoImageIcon.svg'
import { ReactComponent as NoPosterIcon } from '../icons/NoPosterIcon.svg'
import { ReactComponent as NoPortraitIcon } from '../icons/NoPortraitIcon.svg'

interface ImageWithFallbackProps {
	src: string | null
	alt: string
	className?: string
	type: 'poster' | 'portrait'
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, type }) => {
	const [error, setError] = useState(false)

	const handleError = useCallback(() => {
		setError(true)
	}, [])

	// pick fallback icon depending on type
	const FallbackIcon = type === 'portrait' ? NoPortraitIcon : type === 'poster' ? NoPosterIcon : NoImageIcon

	return (
		<div className={className}>
			{!error && src ? (
				<img
					src={src}
					alt={alt}
					loading="lazy"
					decoding="async"
					onError={handleError}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						display: 'block',
					}}
				/>
			) : (
				<FallbackIcon
					style={{
						display: 'block',
						margin: '0 auto',
						width: '100%',
						height: '100%',
						backgroundColor: 'rgb(219, 219, 219)',
					}}
				/>
			)}
		</div>
	)
}
