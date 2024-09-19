import { useNotification } from '@/notification/NotificationContext'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useMutation } from 'convex/react'
import style from '../styles/groupStyle'
import GroupList from './GroupList'

export default function GroupSelect({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string } | null) => void }) {
	const { user } = useUser()
	const { addNotification } = useNotification()

	const [input, setInput] = useState<string>('')
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
	const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(true)

	const createGroup = useMutation(api.group.createGroup)
	const useCode = useMutation(api.invitationCode.useCode)

	const toggleDrawer = () => setDrawerOpen(prev => !prev)

	const clearForm = () => {
		setInput('')
		setModalOpen(false)
		setIsCreatingGroup(true)
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
		if (input.trim()) {
			const notif = isCreatingGroup
				? await createGroup({ userId: user?.id || '', user: user?.username || '', name: input.trim() })
				: await useCode({ code: input.trim(), userId: user?.id || '', user: user?.username || '' })
			addNotification({ success: notif.success ? 1 : 0, message: notif.message })
		}
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
								value={input}
								maxLength={32}
								className={style.input}
								onChange={e => setInput(e.target.value)}
								placeholder={isCreatingGroup ? 'Nom du groupe' : "Code d'invitation"}
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
