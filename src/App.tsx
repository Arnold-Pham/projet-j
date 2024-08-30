import { Authenticated, Unauthenticated } from 'convex/react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SignInButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import Tchat from './components/Tchat'

export default function App() {
	return (
		<main className="container mx-auto">
			<h1 className="text-2xl font-bold mt-5 text-center">Projet J</h1>
			<ThemeToggle />
			<Authenticated>
				<Tchat />
			</Authenticated>
			<Unauthenticated>
				<div className="flex justify-center">
					<SignInButton mode="modal">
						<Button>Sign in</Button>
					</SignInButton>
				</div>
			</Unauthenticated>
		</main>
	)
}
