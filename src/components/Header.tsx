import { ThemeToggle } from './ThemeToggle'

export default function Header() {
	return (
		<header className="h-16 container flex justify-between items-center">
			<h1 className="text-2xl font-bold">PROJET J</h1>
			<ThemeToggle />
		</header>
	)
}
