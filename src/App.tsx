import { Authenticated, Unauthenticated } from 'convex/react'
import GroupSelect from './components/GroupSelect'
import Header from './components/Header'
import Tchat from './components/Tchat'
import { useState } from 'react'

export default function App() {
	const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null)

	return (
		<>
			<Unauthenticated>
				<header className="w-full h-16 flex justify-between items-center bg-tone-bis">
					<Header />
				</header>
			</Unauthenticated>
			<Authenticated>
				<header className="connect h-16 md:ms-80 flex justify-between items-center bg-tone-bis">
					<Header />
				</header>
				<aside>
					<GroupSelect onSelectGroup={setSelectedGroup} />
				</aside>
				<main>{selectedGroup && <Tchat groupId={selectedGroup.id} groupName={selectedGroup.name} />}</main>
			</Authenticated>
		</>
	)
}
