import Login from './Login'
import Theme from './Theme'

export default function Header() {
	return (
		<header className="h-16 bg-tone-bis text-tint">
			<div className="h-16 container flex justify-between items-center">
				<h1 className="text-2xl font-bold">PROJET J</h1>
				<div className="flex gap-3 items-center">
					<Theme />
					<Login />
				</div>
			</div>
		</header>
	)
}
