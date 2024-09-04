import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated } from 'convex/react'
import img from '../images/Shutdown.svg'
import Theme from './Theme'

export default function Header() {
	return (
		<header className="h-16 bg-tone-ter text-tint-one">
			<div className="h-16 container flex justify-between items-center">
				<h1 className="text-2xl font-bold">PROJET J</h1>
				<div className="flex gap-3 items-center">
					<Theme />
					<Authenticated>
						<UserButton />
					</Authenticated>
					<Unauthenticated>
						<SignInButton mode="modal">
							<img src={img} alt="Login Button" className="w-8 h-8 p-1 flex cursor-pointer" />
						</SignInButton>
					</Unauthenticated>
				</div>
			</div>
		</header>
	)
}
