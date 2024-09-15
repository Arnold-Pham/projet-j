import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import style from '../styles/groupStyle'
import GroupList from './GroupList'
import { useState } from 'react'

export default function GroupSelect({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string }) => void }) {
	const { user } = useUser()
	const [groupName, setGroupName] = useState('')
	const [inviteCode, setInviteCode] = useState('')
	const [modalOpen, setModalOpen] = useState(false)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [isCreatingGroup, setIsCreatingGroup] = useState(true)

	const addMember = useMutation(api.members.addMember)
	const createGroup = useMutation(api.group.createGroup)

	const toggleDrawer = () => setDrawerOpen(!drawerOpen)
	const toggleModal = () => setModalOpen(!modalOpen)

	const handleCreateGroup = async (event: any) => {
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
			setGroupName('')
			setModalOpen(false)
		}
	}

	const handleJoinGroup = async (event: any) => {
		event.preventDefault()
		if (inviteCode.trim() !== '') {
			console.log('Rejoindre groupe avec code:', inviteCode)
			setInviteCode('')
			setModalOpen(false)
		}
	}

	const handleModalClick = (event: any) => {
		if (event.target === event.currentTarget) setModalOpen(false)
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
							<h2 className={style.title}>Groupes</h2>
							<div className={style.btnGrp}>
								{/* Bouton pour rejoindre un groupe */}
								<button onClick={toggleModal} className={style.close}>
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
											d="M5 12h14m-7 7V5"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>

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
					</div>

					{/* Liste des groupes */}
					<GroupList onSelectGroup={onSelectGroup} />
				</div>
			</div>

			{drawerOpen && <div className={style.back} onClick={toggleDrawer}></div>}

			{/* Modal pour créer ou rejoindre un groupe */}
			{modalOpen && (
				<div className={style.modalBack} onClick={handleModalClick}>
					<div className={style.modal} onClick={e => e.stopPropagation()}>
						<h2 className={style.title}>{isCreatingGroup ? 'Créer un Groupe' : 'Rejoindre un Groupe'}</h2>

						<form onSubmit={isCreatingGroup ? handleCreateGroup : handleJoinGroup}>
							<input
								required
								maxLength={32}
								value={isCreatingGroup ? groupName : inviteCode}
								className={style.input}
								placeholder={isCreatingGroup ? 'Nom du groupe' : "Code d'invitation"}
								onChange={e => (isCreatingGroup ? setGroupName(e.target.value) : setInviteCode(e.target.value))}
							/>
							<div className={style.btnFormGrp}>
								<button type="button" onClick={toggleModal} className={style.btnCancel}>
									Annuler
								</button>
								<button type="submit" className={style.btnCreate}>
									{isCreatingGroup ? 'Créer' : 'Rejoindre'}
								</button>
							</div>
						</form>

						{/* Toggle entre créer et rejoindre un groupe */}
						<div className="mt-2">
							<p onClick={() => setIsCreatingGroup(!isCreatingGroup)} className="cursor-pointer underline">
								{isCreatingGroup ? 'Rejoindre un groupe ?' : 'Créer un groupe ?'}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
