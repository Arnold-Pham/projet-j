import { useEffect } from 'react'
import Notification from './Notification'

export default function NotificationContainer({
	notifications,
	removeNotification
}: {
	notifications: { id: number; success: number; message: string }[]
	removeNotification: (id: number) => void
}) {
	useEffect(() => {
		const timer = setTimeout(() => {
			if (notifications.length > 0) {
				removeNotification(notifications[0].id)
			}
		}, 2000)

		return () => clearTimeout(timer)
	}, [notifications, removeNotification])

	return (
		<div className="fixed top-4 right-4 space-y-2 z-max w-96 px-3">
			{notifications.map(({ id, success, message }) => (
				<Notification key={id} id={id} success={success} message={message} close={() => removeNotification(id)} />
			))}
		</div>
	)
}
