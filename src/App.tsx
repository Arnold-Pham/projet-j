import { Authenticated } from 'convex/react'
import Header from './components/Header'
// import Tchat from './components/Tchat'
// import GroupSelect from './components/GroupSelect'
import { clerkClient } from '@clerk/clerk-react'

export default function App() {
	async function getUsername(userId: 'user_2lR71du2WSeO2qSSmTG8bvjdCK7') {
		const user = await clerkClient.users.getUser(userId)
		return user?.username
	}

	return (
		<>
			<Header />
			<Authenticated>
				<main className="container mx-auto">
					{/* <Tchat /> */}
					{/* <GroupSelect /> */}
				</main>
			</Authenticated>
		</>
	)
}
