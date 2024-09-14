import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import style from '../styles/groupStyle'
import { useQuery } from 'convex/react'

export default function GroupList() {
	const { user } = useUser()
	const myGroups = useQuery(api.myFunctions.listMyGroups, { userId: user?.id || '' })

	if (!myGroups) return <div>Chargement des groupes...</div>

	return (
		<div className={`tchat ${style.listDiv}`}>
			{myGroups.length === 0 ? (
				<p>Vous n'appartenez à aucun groupe pour le moment.</p>
			) : (
				<ul className={style.list}>
					{myGroups.map(group => (
						<li key={group._id} className={style.listElem}>
							{group.name}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
