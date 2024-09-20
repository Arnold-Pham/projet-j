import style from '../styles/headerStyle'
import Login from './Login'
import Theme from './Theme'

export default function Header() {
	return (
		<>
			<div className={style.header}>
				<h1 className={style.title}>PROJET J</h1>
				<div className={style.buttons}>
					<Theme />
					<Login />
				</div>
			</div>
		</>
	)
}
