import { useState } from 'react'
import { useMutation } from 'convex/react'
import { useUser } from '@clerk/clerk-react'
import { api } from '../../convex/_generated/api'

export default function CreateGroupComponent() {
	const { user } = useUser()
	const [groupName, setGroupName] = useState('')

	const addMember = useMutation(api.myFunctions.addMember)
	const createGroup = useMutation(api.myFunctions.createGroup)

	const handleSubmit = async (event: any) => {
		event.preventDefault()

		try {
			const newGroup = await createGroup({
				userId: user?.id || '',
				user: user?.username || '',
				name: groupName
			})

			await addMember({
				groupId: newGroup,
				group: groupName,
				userId: user?.id || '',
				user: user?.username || '',
				role: 'admin'
			})
			setGroupName('')
			alert("Le groupe a été créé et vous l'avez rejoint !")
		} catch (error) {
			console.error('Erreur lors de la création du groupe :', error)
			alert("Une erreur s'est produite lors de la création du groupe.")
		}
	}

	return (
		<div>
			<h2>Créer un nouveau groupe</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Nom du groupe:
					<input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} required />
				</label>
				<button type="submit">Créer et rejoindre le groupe</button>
			</form>
		</div>
	)
}
