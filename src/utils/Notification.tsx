import { useEffect } from 'react'

export default function Notification({ id, success, message, close }: { id: number; success: number; message: string; close: (id: number) => void }) {
	useEffect(() => {
		const timer = setTimeout(() => close(id), 3000)
		return () => clearTimeout(timer)
	}, [close, id])

	return (
		<div
			className={`${success === 0 ? 'bg-red-200 text-red-700 border-red-700' : 'bg-green-200 text-green-700 border-green-700'} p-4 rounded-md shadow-lg border cursor-pointer`}
			onClick={() => close(id)}
		>
			{message}
		</div>
	)
}
