import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated } from 'convex/react'

export default function Login() {
	return (
		<>
			<Authenticated>
				<UserButton />
			</Authenticated>
			<Unauthenticated>
				<SignInButton mode="modal" />
			</Unauthenticated>
		</>
	)
}
