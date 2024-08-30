import { Authenticated, Unauthenticated } from 'convex/react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SignInButton, useUser } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import Tchat from './components/Tchat'

export default function App() {
	return (
		<main className="container max-w-2xl flex flex-col gap-8">
			<h1 className="text-2xl font-bold my-8 text-center">Projet J</h1>
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

function Username() {
	const { user } = useUser()
	return user?.username
}
