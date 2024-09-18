import { useEffect, useState } from 'react'
import { useMutation } from 'convex/react'
import { useUser } from '@clerk/clerk-react'
import { api } from '../../convex/_generated/api'
import style from '../styles/groupStyle'
import GroupList from './GroupList'

export default function GroupSelect({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string } | null) => void }) {
	const { user } = useUser()

	const [groupName, setGroupName] = useState<string>('')
	const [inviteCode, setInviteCode] = useState<string>('')
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
	const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(true)

	const addMember = useMutation(api.members.addMember)
	const createGroup = useMutation(api.group.createGroup)
	const useCode = useMutation(api.invitationCode.useCode)

	const toggleDrawer = () => setDrawerOpen(prev => !prev)

	const clearForm = () => {
		setModalOpen(false)
		setIsCreatingGroup(true)
		setGroupName('')
		setInviteCode('')
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if (modalOpen) clearForm()
			else if (drawerOpen) toggleDrawer()
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [modalOpen, drawerOpen])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (isCreatingGroup) {
			if (groupName.trim()) {
				const newGroup = await createGroup({ userId: user?.id || '', user: user?.username || '', name: groupName })
				await addMember({ groupId: newGroup, group: groupName, userId: user?.id || '', user: user?.username || '', role: 'admin' })
			}
		} else inviteCode.trim() && (await useCode({ code: inviteCode.trim(), userId: user?.id || '', user: user?.username || '' }))

		clearForm()
	}

	return (
		<div>
			<button onClick={toggleDrawer} className={style.burger}>
				<svg className="w-5 h-5 text-tint-bis" fill="currentColor" viewBox="0 0 24 24">
					<path stroke="currentColor" strokeWidth="3" d="M5 7h14M5 12h14M5 17h14" />
				</svg>
			</button>

			<div className={`${drawerOpen ? 'translate-x-0' : '-translate-x-full'} ${style.drawer}`}>
				<div className={style.header}>
					<h2 className={style.head}>Mes groupes</h2>

					<div className={style.btnGrp}>
						<button onClick={() => setModalOpen(true)} className={style.close}>
							<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-tint-bis">
								<path strokeWidth="3" d="M5 12h14m-7 7V5" stroke="currentColor" />
							</svg>
						</button>

						<button onClick={toggleDrawer} className={style.close}>
							<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-tint-bis">
								<path strokeWidth="3" d="M6 18 17.94 6M18 18 6.06 6" stroke="currentColor" />
							</svg>
						</button>
					</div>
				</div>

				<GroupList onSelectGroup={onSelectGroup} />
			</div>

			{drawerOpen && <div className={style.back} onClick={toggleDrawer}></div>}

			{modalOpen && (
				<div className={style.modalBack} onClick={clearForm}>
					<div className={style.modal} onClick={e => e.stopPropagation()}>
						<h2 className={style.title}>{isCreatingGroup ? 'Créer un Groupe' : 'Rejoindre un Groupe'}</h2>

						<form onSubmit={handleSubmit}>
							<input
								required
								maxLength={32}
								className={style.input}
								value={isCreatingGroup ? groupName : inviteCode}
								placeholder={isCreatingGroup ? 'Nom du groupe' : "Code d'invitation"}
								onChange={e => (isCreatingGroup ? setGroupName(e.target.value) : setInviteCode(e.target.value))}
							/>

							<div className={style.btnFormGrp}>
								<button type="button" onClick={clearForm} className={style.btnCancel}>
									Annuler
								</button>

								<button type="submit" className={style.btnCreate}>
									{isCreatingGroup ? 'Créer' : 'Rejoindre'}
								</button>
							</div>
						</form>

						<p onClick={() => setIsCreatingGroup(prev => !prev)} className="cursor-pointer underline">
							{isCreatingGroup ? 'Rejoindre un groupe ?' : 'Créer un groupe ?'}
						</p>
					</div>
				</div>
			)}
		</div>
	)
}
