import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import Header from './components/Header'
// import Tchat from './components/Tchat'

export default function App() {
	const usersId = ['user_2lN2HlMeP2uPFcPWQSZjsKv55UF', 'user_2lMs83SULhErLTyxanAtXKoo41J']
	return (
		<>
			<Header />
			<main className="container mx-auto">
				<Authenticated>
					{/* <Tchat /> */}
					<></>
				</Authenticated>
				<Unauthenticated>
					<div className="flex justify-center">
						<SignInButton mode="modal">
							<Button>Sign in</Button>
						</SignInButton>
					</div>
				</Unauthenticated>
			</main>
		</>
	)
}
