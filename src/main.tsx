import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import { ErrorBoundary } from './ErrorBoundary'
import { ThemeProvider } from 'next-themes'
import ReactDOM from 'react-dom/client'
import './style/index.css'
import React from 'react'
import App from './App'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider attribute="class" defaultTheme="system">
			<ErrorBoundary>
				<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
					<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
						<App />
					</ConvexProviderWithClerk>
				</ClerkProvider>
			</ErrorBoundary>
		</ThemeProvider>
	</React.StrictMode>
)
