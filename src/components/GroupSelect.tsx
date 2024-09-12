import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { useState } from 'react'

export default function GroupSelect() {
	const { user } = useUser()
	const [inputValue, setInputValue] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const createGroup = useMutation(api.myFunctions.createGroup)
	const joinGroup = useMutation(api.myFunctions.joinGroup)
	const usersGroup = useQuery(api.myFunctions.getUsersGroups, { userId: user?.id || '' })

	const openModal = () => setIsModalOpen(true)
	const closeModal = () => setIsModalOpen(false)

	const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (inputValue.trim() !== '') await createGroup({ userId: user?.id || '', user: user?.username || '', name: inputValue.trim() })
		setTimeout(async () => {
			const groupId = useQuery(api.myFunctions.getGroupId, { userId: user?.id || '', name: inputValue })
			await joinGroup({ groupId: groupId || '', group: '', userId: user?.id || '', user: user?.username || '', role: 'membre' })
		}, 2000)
		closeModal()
	}

	return (
		<>
			{usersGroup?.map((group, index) => <p key={index}>{group.groupId}</p>)}

			<button onClick={openModal}>Open Modal</button>

			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<h2>Créer un groupe</h2>
						<form onSubmit={handleCreateGroup}>
							<input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Nom du groupe" />
							<button type="submit">Enregistrer</button>
						</form>
						<button onClick={closeModal}>Fermer</button>
					</div>
				</div>
			)}
		</>
	)
}
