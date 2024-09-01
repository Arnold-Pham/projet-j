import BoutonDeplace from './components/BoutonDeplace'
import { Authenticated } from 'convex/react'
import Header from './components/Header'
import Tchat from './components/Tchat'

export default function App() {
	return (
		<>
			<Header />
			<Authenticated>
				<main className="container mx-auto">
					<Tchat />
				</main>
				<BoutonDeplace />
			</Authenticated>
		</>
	)
}
