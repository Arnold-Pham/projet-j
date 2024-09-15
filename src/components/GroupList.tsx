import { useQuery, useMutation } from 'convex/react'
import { useState, useRef, useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import style from '../styles/groupStyle'

export default function GroupList({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string }) => void }) {
	const { user } = useUser()
	const [modalOpen, setModalOpen] = useState(false)
	const myGroups = useQuery(api.group.listMyGroups, { userId: user?.id || '' })
	const [selectedGroup, setSelectedGroup] = useState<{ id: string } | null>(null)
	const deleteMember = useMutation(api.members.deleteMember)

	// Référence pour l'élément modal
	const modalRef = useRef<HTMLDivElement>(null)

	// Gestion du clic en dehors du modal
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) setModalOpen(false)
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [modalRef])

	// Loading des groupes
	if (!myGroups) return <div>Chargement des groupes...</div>

	const handleDeleteClick = (groupId: string) => {
		setSelectedGroup({ id: groupId })
		setModalOpen(true)
	}

	const handleConfirmDelete = async () => {
		if (selectedGroup) {
			await deleteMember({ groupId: selectedGroup.id, userId: user?.id || '' })
			setModalOpen(false)
			setSelectedGroup(null)
		}
	}

	return (
		<div className={`grp ${style.listDiv}`}>
			{/* Liste des groupes dans lesquels on est */}
			{myGroups.length !== 0 ? (
				<ul className={style.list}>
					{myGroups.map(group => (
						<li key={group._id} className={style.listElem} onClick={() => onSelectGroup({ id: group._id, name: group.name })}>
							{group.name}
							<button
								className={style.btnLeave}
								onClick={e => {
									e.stopPropagation()
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

			{/* Modal de confirmation */}
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
