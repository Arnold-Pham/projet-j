import { createContext, useContext, useState, ReactNode } from 'react'
import NotificationContainer from './NotificationContainer'

type NotificationType = { id: number; success: number; message: string }

interface NotificationContextType {
	addNotification: (notification: Omit<NotificationType, 'id'>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
	const context = useContext(NotificationContext)
	if (!context) throw new Error('useNotification must be used within a NotificationProvider')
	return context
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	const [notifications, setNotifications] = useState<NotificationType[]>([])

	const addNotification = (notification: Omit<NotificationType, 'id'>) => {
		const id = new Date().getTime()
		setNotifications(prev => [...prev, { ...notification, id }])
	}

	const removeNotification = (id: number) => {
		setNotifications(prev => prev.filter(notification => notification.id !== id))
	}

	return (
		<NotificationContext.Provider value={{ addNotification }}>
			{children}
			<NotificationContainer notifications={notifications} removeNotification={removeNotification} />
		</NotificationContext.Provider>
	)
}
