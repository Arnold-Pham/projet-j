import { useEffect, useState } from 'react'
import Notification from './Notification'

export default function NotificationContainer({ success, message, onAction }: { success: number; message: string; onAction: () => void }) {
	const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([])

	const addNotification = (message: string) => {
		const id = new Date().getTime()
		setNotifications([...notifications, { id, message }])
	}

	const removeNotification = (id: number) => {
		setNotifications(notifications.filter(notification => notification.id !== id))
	}

	useEffect(() => {
		message && addNotification(message)
		success === 1 && onAction()
	}, [message, onAction])

	return (
		<div>
			<div className="fixed top-4 right-4 space-y-2">
				{notifications.map(({ id, message }) => (
					<Notification key={id} id={id} success={success} message={message} close={removeNotification} />
				))}
			</div>
		</div>
	)
}
