import { useNotification } from '@/notification/NotificationContext'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useMutation } from 'convex/react'
import style from '@/styles/groupStyle'
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

	const clearForm = () => {
		setInput('')
		setModalOpen(false)
		setIsCreatingGroup(true)
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if (modalOpen) clearForm()
			else setDrawerOpen(false)
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

			addNotification({ success: notif.success, message: notif.message })
			notif.success && clearForm()
		}
	}

	return (
		<>
			{drawerOpen && <div className={style.drawerBack} onClick={() => setDrawerOpen(false)}></div>}

			<div className={style.drawer + (drawerOpen ? ' translate-x-0' : ' -translate-x-full')}>
				<div className={style.header}>
					<h2 className={style.title}>Mes groupes</h2>
					<button className={style.button} onClick={() => setModalOpen(true)}>
						<svg className={style.svg} fill="currentColor" viewBox="0 0 24 24">
							<path strokeWidth="3" stroke="currentColor" d="M5 12h14m-7 7V5" />
						</svg>
					</button>
				</div>

				<GroupList onSelectGroup={onSelectGroup} />

				<button className={style.drawerButton + ' md:hidden'} onClick={() => setDrawerOpen(!drawerOpen)}>
					<svg className={style.svg} fill="currentColor" viewBox="0 0 24 24">
						{drawerOpen ? (
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
						) : (
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
						)}
					</svg>
				</button>
			</div>

			{modalOpen && (
				<div className={style.modalBack} onClick={clearForm}>
					<div className={style.modal} onClick={e => e.stopPropagation()}>
						<h2 className={style.title + ' mb-2'}>{isCreatingGroup ? 'Créer un Groupe' : 'Rejoindre un Groupe'}</h2>

						<form onSubmit={handleSubmit}>
							<input
								className={style.input}
								required
								value={input}
								maxLength={32}
								onChange={e => setInput(e.target.value)}
								placeholder={isCreatingGroup ? 'Nom du groupe' : "Code d'invitation"}
							/>

							<div className={style.buttonGroup + ' mt-2'}>
								<button className={style.buttonStyle + ' bg-tone-ter'} type="button" onClick={clearForm}>
									Annuler
								</button>

								<button
									className={style.buttonStyle + (isCreatingGroup ? ' bg-green-800 text-white' : ' bg-blue-800 text-white')}
									type="submit"
								>
									{isCreatingGroup ? 'Créer' : 'Rejoindre'}
								</button>
							</div>
						</form>

						<hr className={style.separator} />

						<p className={style.change} onClick={() => setIsCreatingGroup(prev => !prev)}>
							{isCreatingGroup ? 'Rejoindre un groupe ?' : 'Créer un groupe ?'}
						</p>
					</div>
				</div>
			)}
		</>
	)
}
