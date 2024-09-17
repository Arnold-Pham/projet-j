import { Id } from '../../convex/_generated/dataModel'
import { useQuery, useMutation } from 'convex/react'
import { useState, useRef, useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import style from '../styles/groupStyle'

export default function GroupList({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string } | null) => void }) {
	const { user } = useUser()

	const [maxUses, setMaxUses] = useState<string>('')
	const [duration, setDuration] = useState<string>('')
	const [noExpiry, setNoExpiry] = useState<boolean>(false)
	const [codeModal, setCodeModal] = useState<boolean>(false)
	const [leaveModal, setLeaveModal] = useState<boolean>(false)
	const [deleteModal, setDeleteModal] = useState<boolean>(false)
	const [codeError, setCodeError] = useState<string | null>(null)
	const [durationUnit, setDurationUnit] = useState<string>('days')
	const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null)

	const deleteGroup = useMutation(api.group.deleteGroup)
	const listMembers = useMutation(api.members.listMembers)
	const deleteMember = useMutation(api.members.deleteMember)
	const createCode = useMutation(api.invitationCode.createCode)
	const myGroups = useQuery(api.group.listMyGroups, { userId: user?.id || '' })

	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				setCodeModal(false)
				setLeaveModal(false)
				setDeleteModal(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [modalRef])

	const handleCode = (groupId: string, group: string) => {
		setSelectedGroup({ id: groupId, name: group })
		setCodeError(null)
		setCodeModal(true)
	}

	const handleConfirmCode = async () => {
		if ((duration !== '' && !noExpiry) || noExpiry) {
			const maxUse = getMaxUses()
			const expire = convertToUnix()

			if (selectedGroup) {
				await createCode({
					groupId: selectedGroup.id as Id<'group'>,
					group: selectedGroup.name,
					creatorId: user?.id || '',
					maxUses: maxUse,
					expiresAt: expire
				})
			}

			codeClear()
		} else setCodeError('Choisisez une durée de vie')
	}

	const handleDelete = (groupId: string, group: string) => {
		setSelectedGroup({ id: groupId, name: group })
		setDeleteModal(true)
	}

	const handleConfirmDelete = async () => {
		if (selectedGroup) {
			await deleteGroup({ groupId: selectedGroup.id as Id<'group'> })
			onSelectGroup(null)
			setDeleteModal(false)
			setSelectedGroup(null)
		}
	}

	const handleLeave = async (groupId: string, group: string) => {
		setSelectedGroup({ id: groupId, name: group })
		setLeaveModal(true)
	}

	const handleConfirmLeave = async () => {
		if (selectedGroup) {
			const result = await listMembers({ groupId: selectedGroup.id })

			result.length === 1
				? await deleteGroup({ groupId: selectedGroup.id as Id<'group'> })
				: await deleteMember({ groupId: selectedGroup.id as Id<'group'>, userId: user?.id || '' })

			onSelectGroup(null)
			setLeaveModal(false)
			setSelectedGroup(null)
		}
	}

	const convertToUnix = () => {
		if (noExpiry) return undefined

		const secondsInDay = 86400
		const secondsInWeek = secondsInDay * 7
		const secondsInMonth = secondsInDay * 30

		let durationInSeconds = 0
		if (durationUnit === 'days') durationInSeconds = Number(duration) * secondsInDay
		if (durationUnit === 'weeks') durationInSeconds = Number(duration) * secondsInWeek
		if (durationUnit === 'months') durationInSeconds = Number(duration) * secondsInMonth

		return Math.floor(Date.now()) + durationInSeconds * 1000
	}

	const getMaxUses = () => (maxUses === '' || Number(maxUses) <= 0 ? undefined : Number(maxUses))

	const codeClear = () => {
		setMaxUses('')
		setDuration('')
		setNoExpiry(false)
		setCodeError(null)
		setCodeModal(false)
		setSelectedGroup(null)
		setDurationUnit('days')
	}

	if (!myGroups) return <div>Chargement des groupes en cours...</div>

	return (
		<div className={`grp ${style.listDiv}`}>
			{myGroups.length !== 0 ? (
				<ul className={style.list}>
					{myGroups.map(group => (
						<li key={group._id} className={style.listElem} onClick={() => onSelectGroup({ id: group._id, name: group.name })}>
							{group.name}
							<div className={style.btnGrp}>
								{group.role === 'admin' && (
									<button
										className={style.btnLeave}
										onClick={e => {
											e.stopPropagation()
											handleCode(group._id, group.name)
										}}
									>
										<svg width="24" height="24" fill="none" aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 text-white">
											<path
												stroke-width="2"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
											/>
										</svg>
									</button>
								)}

								<button
									className={style.btnLeave}
									onClick={e => {
										e.stopPropagation()
										handleLeave(group._id, group.name)
									}}
								>
									<svg width="24" height="24" aria-hidden="true" fill="none" viewBox="0 0 24 24" className="w-5 h-5 text-white">
										<path
											stroke-width="2"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
										/>
									</svg>
								</button>

								{group.role === 'admin' && (
									<button
										className={style.btnLeave}
										onClick={e => {
											e.stopPropagation()
											handleDelete(group._id, group.name)
										}}
									>
										<svg width="24" height="24" fill="none" aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 text-white">
											<path
												stroke-width="2"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
											/>
										</svg>
									</button>
								)}
							</div>
						</li>
					))}
				</ul>
			) : (
				<p className={style.list}>Vous n'appartenez à aucun groupe.</p>
			)}

			{leaveModal && (
				<div className={style.modalBack}>
					<div ref={modalRef} className={style.modal}>
						<h2 className={style.title}>Vous partez ?</h2>
						<p className="mt-2 mb-4">Êtes-vous sûr de vouloir quitter ce groupe ?</p>
						<div className={style.btnGrp}>
							<button onClick={() => setLeaveModal(false)} className={style.btnCancel}>
								Non
							</button>
							<button onClick={handleConfirmLeave} className={style.btnLeave}>
								Quitter
							</button>
						</div>
					</div>
				</div>
			)}

			{deleteModal && (
				<div className={style.modalBack}>
					<div ref={modalRef} className={style.modal}>
						<h2 className={style.title}>Vous voulez vraiment supprimer le groupe ?</h2>
						<p className="my-2">Vous allez supprimer le groupe, virer tous ses membres, et détruire tous les messages.</p>
						<p className="my-2">Cette action est irréversible.</p>
						<div className={style.btnGrp}>
							<button onClick={() => setDeleteModal(false)} className={style.btnCancel}>
								Annuler
							</button>
							<button onClick={handleConfirmDelete} className={style.btnLeave}>
								Supprimer
							</button>
						</div>
					</div>
				</div>
			)}

			{codeModal && (
				<div className={style.modalBack}>
					<div ref={modalRef} className={style.modal}>
						<h2 className={style.title}>Vous voulez inviter des gens ?</h2>

						{codeError && <p className="p-4 my-2 rounded-sm bg-tone-ter text-red-500 text-center">{codeError}</p>}

						<p>Expiration:</p>
						{!noExpiry && (
							<div className="flex gap-1 mb-2">
								<input
									type="number"
									value={duration}
									placeholder="Durée"
									onChange={e => {
										setCodeError(null)
										setDuration(e.target.value)
									}}
									className={`${style.input}`}
								/>
								<select value={durationUnit} onChange={e => setDurationUnit(e.target.value)} className={style.input}>
									<option value="days">Jour(s)</option>
									<option value="weeks">Semaine(s)</option>
									<option value="months">Mois</option>
								</select>
							</div>
						)}

						<label className="flex items-center my-2">
							<input
								type="checkbox"
								checked={noExpiry}
								onChange={() => {
									setCodeError(null)
									setNoExpiry(!noExpiry)
								}}
							/>
							Pas d'expiration (Never)
						</label>
						<label>
							Utilisations max :
							<input
								type="number"
								value={maxUses}
								onChange={e => setMaxUses(e.target.value)}
								className={style.input}
								placeholder="Utilisations max"
							/>
						</label>
						<div className={`${style.btnGrp} mt-4`}>
							<button onClick={codeClear} className={style.btnCancel}>
								Annuler
							</button>
							<button onClick={handleConfirmCode} className={style.btnLeave}>
								Confirmer
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
