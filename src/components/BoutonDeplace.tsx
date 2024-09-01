import { useState, useEffect, useRef } from 'react'

export default function BoutonDeplace() {
	const [isDragging, setIsDragging] = useState(false)
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const hiddenFocusRef = useRef(null) // Référence à un élément invisible pour gérer le focus

	const handleMouseDown = e => {
		e.preventDefault()
		setIsDragging(true)
		const rect = e.target.getBoundingClientRect()
		setOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		})
	}

	useEffect(() => {
		const handleMouseMove = e => {
			if (isDragging) {
				setPosition({
					x: e.clientX - offset.x,
					y: e.clientY - offset.y
				})
			}
		}

		const handleMouseUp = () => {
			if (isDragging) {
				setIsDragging(false)

				// Focaliser l'élément caché pour enlever le focus du bouton
				if (hiddenFocusRef.current) {
					hiddenFocusRef.current.focus()
				}
			}
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging, offset])

	return (
		<>
			{/* Élément invisible pour recevoir le focus */}
			<input
				ref={hiddenFocusRef}
				style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
				tabIndex={-1} // Ne peut pas être atteint via le clavier
				aria-hidden="true"
			/>

			<div
				className="cursor-pointer flex items-center justify-center text-white fixed select-none"
				style={{ top: `${position.y}px`, left: `${position.x}px` }}
				onMouseDown={handleMouseDown}
				onDragStart={e => e.preventDefault()} // Empêcher le drag de l'image
				tabIndex={1000}
			>
				<button className="w-8 h-8 rounded-full bg-primary"></button>
			</div>
		</>
	)
}
