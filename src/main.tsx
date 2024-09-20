import { NotificationProvider } from '@/notification/NotificationContext'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexReactClient } from 'convex/react'
import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App'
import './index.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<NotificationProvider>
					<App />
				</NotificationProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	</React.StrictMode>
)
