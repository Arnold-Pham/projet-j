import { Authenticated } from 'convex/react'
import style from '../styles/headerStyle'
import GroupSelect from './GroupSelect'
import Login from './Login'
import Theme from './Theme'

export default function Header({ onSelectGroup }: { onSelectGroup: (group: { id: string; name: string } | null) => void }) {
	return (
		<header className={style.head}>
			<div className={style.header}>
				<h1 className={style.title}>PROJET J</h1>
				<div className={style.buttons}>
					<Theme />
					<Authenticated>
						<GroupSelect onSelectGroup={onSelectGroup} />
					</Authenticated>
					<Login />
				</div>
			</div>
		</header>
	)
}
