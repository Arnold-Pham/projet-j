import { Authenticated } from 'convex/react'
import Header from './components/Header'
import Tchat from './components/Tchat'
import { useState } from 'react'

export default function App() {
	const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null)

	return (
		<>
			<Header onSelectGroup={setSelectedGroup} />
			<Authenticated>
				<main className="container mx-auto">{selectedGroup && <Tchat groupId={selectedGroup.id} groupName={selectedGroup.name} />}</main>
			</Authenticated>
		</>
	)
}
