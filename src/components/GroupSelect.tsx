import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import style from '../styles/groupStyle'
import GroupList from './GroupList'
import { useState } from 'react'

export default function GroupSelect({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string }) => void }) {
	const { user } = useUser()
	const [groupName, setGroupName] = useState('')
	const [drawerOpen, setDrawerOpen] = useState(false)

	//	Gère fonctions externes groupes
	const addMember = useMutation(api.myFunctions.addMember)
	const createGroup = useMutation(api.myFunctions.createGroup)

	//	Gère le menu caché gauche
	const toggleDrawer = () => setDrawerOpen(!drawerOpen)

	//	Création de groupe + auto join
	const handleSubmit = async (event: any) => {
		event.preventDefault()
		if (groupName.trim() !== '') {
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
		}
		setGroupName('')
	}

	return (
		<div>
			{/* Bouton burger pour ouvrir le tiroir */}
			<button onClick={toggleDrawer} className={style.burger}>
				<svg className="w-5 h-5 text-tint-bis" aria-hidden="true" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
					<path stroke="currentColor" stroke-linecap="round" stroke-width="3" d="M5 7h14M5 12h14M5 17h14" />
				</svg>
			</button>

			{/* Le tiroir */}
			<div className={`${drawerOpen ? 'translate-x-0' : '-translate-x-full'} ${style.drawer}`}>
				<div>
					<div className={style.head}>
						<div className={style.header}>
							<h2 className="text-lg font-semibold">Groupes</h2>

							{/* Bouton fermer le tiroir */}
							<button onClick={toggleDrawer} className={style.close}>
								<svg
									width="24"
									height="24"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 24 24"
									className="w-5 h-5 text-tint-bis"
								>
									<path
										stroke-width="3"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6 18 17.94 6M18 18 6.06 6"
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Liste des groupes */}
					<GroupList onSelectGroup={onSelectGroup} />

					{/* Création de groupe */}
					<form onSubmit={handleSubmit} className={style.form}>
						<label>Créer un groupe : </label>
						<input
							required
							maxLength={32}
							value={groupName}
							className={style.input}
							placeholder="Nom du groupe"
							onChange={e => setGroupName(e.target.value)}
						/>
						<button type="submit" className={style.button}></button>
					</form>
				</div>
			</div>

			{drawerOpen && <div className={style.back} onClick={toggleDrawer}></div>}
		</div>
	)
}
