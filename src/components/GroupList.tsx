import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import style from '../styles/groupStyle'
import { useQuery } from 'convex/react'

export default function GroupList({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string }) => void }) {
	const { user } = useUser()
	const myGroups = useQuery(api.myFunctions.listMyGroups, { userId: user?.id || '' })

	//	Loading des groupes
	if (!myGroups) return <div>Chargement des groupes...</div>

	return (
		<div className={`tchat ${style.listDiv}`}>
			{/* Liste des groupes dans lesquels on est */}
			{myGroups.length !== 0 ? (
				<ul className={style.list}>
					{myGroups.map(group => (
						<li key={group._id} className={style.listElem} onClick={() => onSelectGroup({ id: group._id, name: group.name })}>
							{group.name}
						</li>
					))}
				</ul>
			) : (
				<p>Vous n'appartenez à aucun groupe pour le moment.</p>
			)}
		</div>
	)
}
