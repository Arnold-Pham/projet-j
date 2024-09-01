import { useState, useEffect } from 'react'

export default function BoutonDeplace() {
	const [isDragging, setIsDragging] = useState(false) // Mode déplacement
	const [position, setPosition] = useState({ x: 0, y: 0 }) // Position de départ
	const [offset, setOffset] = useState({ x: 0, y: 0 }) // Différence de position

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
			<div
				className="cursor-pointer flex items-center justify-center text-white fixed select-none"
				style={{ top: `${position.y}px`, left: `${position.x}px` }}
				onMouseDown={handleMouseDown}
				onDragStart={e => e.preventDefault()}
				tabIndex={1000}
			>
				<button className="w-8 h-8 rounded-full bg-primary"></button>
			</div>
		</>
	)
}
