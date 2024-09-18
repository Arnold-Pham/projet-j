import { Id } from '../../convex/_generated/dataModel'
import { useQuery, useMutation } from 'convex/react'
import { useState, useEffect, useRef } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import style from '../styles/groupStyle'

export default function GroupList({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string } | null) => void }) {
	const { user } = useUser()

	const [modal, setModal] = useState<{ type: 'leave' | 'delete' | 'createCode' | ''; group: { id: string; name: string } | null }>({
		type: '',
		group: null
	})

	const [codeParams, setCodeParams] = useState<{ maxUses: string; duration: string; unit: string; noExpiry: boolean; error: string | null }>({
		maxUses: '',
		duration: '',
		unit: 'days',
		noExpiry: false,
		error: null
	})

	const modalRef = useRef<HTMLDivElement>(null)

	const deleteGroup = useMutation(api.group.deleteGroup)
	const listMembers = useMutation(api.members.listMembers)
	const deleteMember = useMutation(api.members.deleteMember)
	const createCode = useMutation(api.invitationCode.createCode)
	const myGroups = useQuery(api.group.listMyGroups, { userId: user?.id || '' })

	const closeModal = (e: MouseEvent) => modalRef.current && !modalRef.current.contains(e.target as Node) && setModal({ type: '', group: null })

	useEffect(() => {
		document.addEventListener('mousedown', closeModal)
		return () => document.removeEventListener('mousedown', closeModal)
	}, [])

	const handleAction = async (action: 'delete' | 'leave' | 'createCode' | '') => {
		if (!modal.group || action === '') return
		const { id } = modal.group

		if (action === 'delete')
			await deleteGroup({
				groupId: id as Id<'group'>
			})

		if (action === 'leave') {
			const members = await listMembers({
				groupId: id
			})

			members.length === 1
				? await deleteGroup({
						groupId: id as Id<'group'>
					})
				: await deleteMember({
						groupId: id as Id<'group'>,
						userId: user?.id || ''
					})
		}

		if (action === 'createCode') {
			const { maxUses, duration, unit, noExpiry } = codeParams
			const expiresAt = noExpiry
				? undefined
				: Date.now() + Number(duration) * (unit === 'days' ? 86400 : unit === 'weeks' ? 604800 : 2592000) * 1000

			await createCode({
				groupId: id as Id<'group'>,
				group: modal.group.name,
				creatorId: user?.id || '',
				maxUses: Number(maxUses) || undefined,
				expiresAt
			})

			setCodeParams({
				maxUses: '',
				duration: '',
				unit: 'days',
				noExpiry: false,
				error: null
			})
		}

		setModal({ type: '', group: null })

		onSelectGroup(null)
	}

	if (!myGroups) return <div>Chargement des groupes...</div>

	return (
		<div className={style.listDiv}>
			<ul className={style.listUl}>
				{myGroups.length > 0 ? (
					<>
						{myGroups.map(group => (
							<li key={group._id} className={style.listLi} onClick={() => onSelectGroup({ id: group._id, name: group.name })}>
								{group.name}

								<div className={style.btnGrp}>
									{group.role === 'admin' && (
										<button
											onClick={e => {
												e.stopPropagation()
												setModal({
													type: 'createCode',
													group: {
														id: group._id,
														name: group.name
													}
												})
											}}
											className={style.btnAction}
										>
											<svg width="24" height="24" fill="none" aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5">
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
										onClick={e => {
											e.stopPropagation()
											setModal({
												type: 'leave',
												group: {
													id: group._id,
													name: group.name
												}
											})
										}}
										className={style.btnAction}
									>
										<svg width="24" height="24" aria-hidden="true" fill="none" viewBox="0 0 24 24" className="w-5 h-5">
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
											onClick={e => {
												e.stopPropagation()
												setModal({
													type: 'delete',
													group: {
														id: group._id,
														name: group.name
													}
												})
											}}
											className={style.btnAction}
										>
											<svg width="24" height="24" fill="none" aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5">
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
					</>
				) : (
					<li className={style.listLi}>Aucun groupe disponible.</li>
				)}
			</ul>

			{modal.type && (
				<div className={style.modalBack}>
					<div className={style.modal} ref={modalRef}>
						{modal.type === 'leave' && <p className={style.title}>Confirmer votre départ ?</p>}

						{modal.type === 'delete' && <p className={style.title}>Confirmer la suppression du groupe ?</p>}

						{modal.type === 'createCode' && (
							<>
								<p className={style.title}>Création d'un code d'invitation</p>

								{codeParams.error && <p>{codeParams.error}</p>}

								<input
									type="number"
									className={style.input}
									value={codeParams.maxUses}
									onChange={e => setCodeParams({ ...codeParams, maxUses: e.target.value })}
									placeholder="Utilisations max"
								/>

								{!codeParams.noExpiry && (
									<div className={style.btnGrp}>
										<input
											type="number"
											placeholder="Durée"
											className={style.input}
											value={codeParams.duration}
											onChange={e => setCodeParams({ ...codeParams, duration: e.target.value })}
										/>
										<select
											value={codeParams.unit}
											className={style.input}
											onChange={e => setCodeParams({ ...codeParams, unit: e.target.value })}
										>
											<option value="days">Jour(s)</option>
											<option value="weeks">Semaine(s)</option>
											<option value="months">Mois</option>
										</select>
									</div>
								)}

								<label>
									<input
										type="checkbox"
										checked={codeParams.noExpiry}
										onChange={() => setCodeParams({ ...codeParams, noExpiry: !codeParams.noExpiry })}
									/>{' '}
									Pas d'expiration
								</label>
							</>
						)}

						<div className={style.btnFormGrp}>
							<button className={style.btnLeave} onClick={() => handleAction(modal.type)}>
								Confirmer
							</button>

							<button className={style.btnCancel} onClick={() => setModal({ type: '', group: null })}>
								Annuler
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
