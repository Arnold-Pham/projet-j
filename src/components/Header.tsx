import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated } from 'convex/react'
import img from '../images/Shutdown.svg'

export default function Header() {
	return (
		<header className="h-16 container flex justify-between items-center">
			<h1 className="text-2xl font-bold">PROJET J</h1>
			<div className="flex gap-3 items-center">
				{/* Theme */}
				<Authenticated>
					<UserButton />
				</Authenticated>
				<Unauthenticated>
					<SignInButton mode="modal">
						<img src={img} alt="Login Button" className="w-8 h-8 bg-white text-primary rounded-full p-1 cursor-pointer" />
					</SignInButton>
				</Unauthenticated>
			</div>
		</header>
	)
}
