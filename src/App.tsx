import { Authenticated } from 'convex/react'
import Header from './components/Header'
// import Tchat from './components/Tchat'
import GroupSelect from './components/GroupSelect'

export default function App() {
	return (
		<>
			<Header />
			<Authenticated>
				<main className="container mx-auto">
					{/* <Tchat /> */}
					<GroupSelect />
				</main>
			</Authenticated>
		</>
	)
}
