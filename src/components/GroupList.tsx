import { useQuery, useMutation } from 'convex/react'
import { useState, useRef, useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import style from '../styles/groupStyle'

export default function GroupList({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string }) => void }) {
	//	Obtention des informations utilisateur via Clerk
	const { user } = useUser()

	//	États pour gérer l'état du modal et la selection de groupe
	const [modalOpen, setModalOpen] = useState(false)
	const [selectedGroup, setSelectedGroup] = useState<{ id: string } | null>(null)

	//	Mutation pour supprimer un membre du groupe
	const deleteMember = useMutation(api.members.deleteMember)

	//	Query pour récupérer les groupes de l'utilisateur
	const myGroups = useQuery(api.group.listMyGroups, { userId: user?.id || '' })

	//	Référence pour l'élément modal
	const modalRef = useRef<HTMLDivElement>(null)

	//	Gestion du clic en dehors du modal pour fermer le modal
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) setModalOpen(false)
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [modalRef])

	//	Affichage d'un message de chargement si les groupes ne sont pas encore disponibles
	if (!myGroups) return <div>Chargement des groupes...</div>

	//	Fonction pour ouvrir le modal de confirmation de suppression
	const handleDeleteClick = (groupId: string) => {
		setSelectedGroup({ id: groupId })
		setModalOpen(true)
	}

	//	Fonction pour confirmer la suppression du groupe
	const handleConfirmDelete = async () => {
		if (selectedGroup) {
			await deleteMember({ groupId: selectedGroup.id, userId: user?.id || '' })
			setModalOpen(false)
			setSelectedGroup(null)
		}
	}

	return (
		<div className={`grp ${style.listDiv}`}>
			{/* Liste des groupes auxquels l'utilisateur appartient */}
			{myGroups.length !== 0 ? (
				<ul className={style.list}>
					{myGroups.map(group => (
						<li key={group._id} className={style.listElem} onClick={() => onSelectGroup({ id: group._id, name: group.name })}>
							{group.name}
							<button
								className={style.btnLeave}
								onClick={e => {
									e.stopPropagation() // Empêche le clic sur le bouton de sélectionner l'élément de la liste
									handleDeleteClick(group._id)
								}}
							>
								Quitter
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className={style.list}>Vous n'appartenez à aucun groupe pour le moment.</p>
			)}

			{/* Modal de confirmation de suppression */}
			{modalOpen && (
				<div className={style.modalBack}>
					<div ref={modalRef} className={style.modal}>
						<h2 className={style.title}>Confirmer le départ</h2>
						<p className="mt-2 mb-4">Êtes-vous sûr de vouloir quitter ce groupe ?</p>
						<div className={style.btnGrp}>
							<button onClick={() => setModalOpen(false)} className={style.btnCancel}>
								Annuler
							</button>
							<button onClick={handleConfirmDelete} className={style.btnLeave}>
								Quitter
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
