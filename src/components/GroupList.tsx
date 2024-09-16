import { Id } from '../../convex/_generated/dataModel'
import { useQuery, useMutation } from 'convex/react'
import { useState, useRef, useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import style from '../styles/groupStyle'

export default function GroupList({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string }) => void }) {
	//	Obtention des informations utilisateur via Clerk
	const { user } = useUser()
	const [noExpiry, setNoExpiry] = useState(false) // État pour la case à cocher "Pas d'expiration"
	const [duration, setDuration] = useState('') // État pour la durée de validité (nombre)
	const [durationUnit, setDurationUnit] = useState('days') // État pour l'unité de durée (jours, semaines, mois)
	const [maxUses, setMaxUses] = useState('') // État pour le nombre maximum d'utilisations

	//	États pour gérer l'état du modal et la selection de groupe
	const [modalOpen, setModalOpen] = useState(false)
	const [codeModalOpen, setCodeModalOpen] = useState(false)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [selectedGroup, setSelectedGroup] = useState<{ id: string } | null>(null)

	//	Mutation pour supprimer un membre du groupe
	const createCode = useMutation(api.invitationCode.createCode)
	const deleteMember = useMutation(api.members.deleteMember)
	const deleteGroup = useMutation(api.group.deleteGroup)

	//	Query pour récupérer les groupes de l'utilisateur
	const myGroups = useQuery(api.group.listMyGroups, { userId: user?.id || '' })

	//	Référence pour l'élément modal
	const modalRef = useRef<HTMLDivElement>(null)

	//	Gestion du clic en dehors du modal pour fermer le modal
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				setModalOpen(false)
				setDeleteModalOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [modalRef])

	//	Affichage d'un message de chargement si les groupes ne sont pas encore disponibles
	if (!myGroups) return <div>Chargement des groupes...</div>

	//	Fonction pour ouvrir le modal de suppression de membre (quitter groupe)
	const handleLeave = (groupId: string) => {
		setSelectedGroup({ id: groupId })
		setModalOpen(true)
	}

	//	Fonction pour confirmer le départ du groupe
	const handleConfirmLeave = async () => {
		if (selectedGroup) {
			await deleteMember({ groupId: selectedGroup.id as Id<'group'>, userId: user?.id || '' })
			setModalOpen(false)
			setSelectedGroup(null)
		}
	}

	//	Fonction pour ouvrir le modal de suppression définitive
	const handleDelete = (groupId: string) => {
		setSelectedGroup({ id: groupId })
		setDeleteModalOpen(true)
	}

	//	Fonction pour confirmer la suppression du groupe en intégralité
	const handleConfirmDelete = async () => {
		if (selectedGroup) {
			await deleteGroup({ groupId: selectedGroup.id as Id<'group'> })
			setDeleteModalOpen(false)
			setSelectedGroup(null)
		}
	}

	//	Fonction pour ouvrir le modal de code
	const handleCode = (groupId: string) => {
		setSelectedGroup({ id: groupId })
		setCodeModalOpen(true)
	}

	const convertToUnix = () => {
		if (noExpiry) return undefined

		let durationInSeconds = 0
		const secondsInDay = 86400
		const secondsInWeek = secondsInDay * 7
		const secondsInMonth = secondsInDay * 30

		if (durationUnit === 'days') durationInSeconds = Number(duration) * secondsInDay
		if (durationUnit === 'weeks') durationInSeconds = Number(duration) * secondsInWeek
		if (durationUnit === 'months') durationInSeconds = Number(duration) * secondsInMonth

		const dateMax = Math.floor(Date.now()) + durationInSeconds
		return dateMax
	}

	const getMaxUses = () => {
		if (maxUses === '' || Number(maxUses) <= 0) return undefined
		return Number(maxUses)
	}

	//	Fonction pour confirmer les paramètres d'expiration du code
	const handleConfirmCode = async () => {
		const maxUse = getMaxUses()
		const expire = convertToUnix()
		if (selectedGroup !== null)
			await createCode({
				groupId: selectedGroup.id as Id<'group'>,
				creatorId: user?.id || '',
				maxUses: maxUse,
				expiresAt: expire
			})
		codeClear()
	}

	const codeClear = () => {
		setMaxUses('')
		setDuration('')
		setNoExpiry(false)
		setSelectedGroup(null)
		setCodeModalOpen(false)
		setDurationUnit('days')
	}

	return (
		<div className={`grp ${style.listDiv}`}>
			{/* Liste des groupes auxquels l'utilisateur appartient */}
			{myGroups.length !== 0 ? (
				<ul className={style.list}>
					{myGroups.map(group => (
						<li key={group._id} className={style.listElem} onClick={() => onSelectGroup({ id: group._id, name: group.name })}>
							{group.name}
							<div className={style.btnGrp}>
								{group.role === 'admin' ? (
									<button
										className={style.btnLeave}
										onClick={e => {
											e.stopPropagation()
											handleCode(group._id)
										}}
									>
										Code
									</button>
								) : null}

								{/* Bouton pour quitter un groupe */}
								<button
									className={style.btnLeave}
									onClick={e => {
										e.stopPropagation() // Empêche le clic sur le bouton de sélectionner l'élément de la liste
										handleLeave(group._id)
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

								{/* Bouton pour supprimer un groupe */}
								{group.userId === user?.id && (
									<button
										className={style.btnLeave}
										onClick={e => {
											e.stopPropagation() // Empêche le clic sur le bouton de sélectionner l'élément de la liste
											handleDelete(group._id)
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
				<p className={style.list}>Vous n'appartenez à aucun groupe pour le moment.</p>
			)}

			{/* Modal de confirmation de départ */}
			{modalOpen && (
				<div className={style.modalBack}>
					<div ref={modalRef} className={style.modal}>
						<h2 className={style.title}>Confirmer le départ</h2>
						<p className="mt-2 mb-4">Êtes-vous sûr de vouloir quitter ce groupe ?</p>
						<div className={style.btnGrp}>
							<button onClick={() => setModalOpen(false)} className={style.btnCancel}>
								Annuler
							</button>
							<button onClick={handleConfirmLeave} className={style.btnLeave}>
								Quitter
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal de suppression définitive */}
			{deleteModalOpen && (
				<div className={style.modalBack}>
					<div ref={modalRef} className={style.modal}>
						<h2 className={style.title}>Supprimer le groupe</h2>
						<p className="mt-2 mb-4">Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.</p>
						<div className={style.btnGrp}>
							<button onClick={() => setDeleteModalOpen(false)} className={style.btnCancel}>
								Annuler
							</button>
							<button onClick={handleConfirmDelete} className={style.btnLeave}>
								Supprimer
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal pour les paramètres du code */}
			{codeModalOpen && (
				<div className={style.modalBack}>
					<div ref={modalRef} className={style.modal}>
						<h2 className={style.title}>Création du code d'invitation</h2>
						<p>Expiration:</p>

						{/* Si "never" n'est pas coché, afficher les champs de durée */}
						{!noExpiry && (
							<div className="flex">
								<input
									type="number"
									value={duration}
									placeholder="Durée"
									onChange={e => setDuration(e.target.value)}
									className={`${style.input}`}
								/>
								<select value={durationUnit} onChange={e => setDurationUnit(e.target.value)} className={style.input}>
									<option value="days">Jour(s)</option>
									<option value="weeks">Semaine(s)</option>
									<option value="months">Mois</option>
								</select>
							</div>
						)}

						{/* Checkbox "never" pour désactiver l'expiration */}
						<label className="flex items-center">
							<input type="checkbox" checked={noExpiry} onChange={() => setNoExpiry(!noExpiry)} />
							Pas d'expiration (Never)
						</label>

						{/* Nombre maximum d'utilisations */}
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

						<div className={style.btnGrp}>
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
