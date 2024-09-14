import { useEffect, useState } from 'react'
import style from '../styles/themeStyle'

export default function Theme() {
	const THEME_KEY = 'theme'
	const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem(THEME_KEY)
		if (savedTheme) return savedTheme
		return prefersDarkMode ? 'dark' : 'light'
	})

	const [showButtons, setShowButtons] = useState(false)

	useEffect(() => {
		theme === 'system' ? document.body.classList.toggle('dark', prefersDarkMode) : document.body.classList.toggle('dark', theme === 'dark')
		localStorage.setItem(THEME_KEY, theme)
	}, [theme])

	const handleThemeChange = (newTheme: any) => {
		setTheme(newTheme)
		setShowButtons(false)
	}

	const toggleButtons = () => setShowButtons(!showButtons)

	const renderIcon = (theme: any) => {
		switch (theme) {
			case 'light':
				return (
					<svg className="w-6 h-6 text-tint-bis" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
						<path d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z" />
					</svg>
				)
			case 'dark':
				return (
					<svg className="w-5 h-5 text-tint-bis" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
						<path d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z" />
					</svg>
				)
			case 'system':
				return (
					<svg className="w-6 h-6 text-tint-bis" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 8a1 1 0 0 0-1 1v10H9a1 1 0 1 0 0 2h11a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-8Zm4 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
						<path d="M5 3a2 2 0 0 0-2 2v6h6V9a3 3 0 0 1 3-3h8c.35 0 .687.06 1 .17V5a2 2 0 0 0-2-2H5Zm4 10H3v2a2 2 0 0 0 2 2h4v-4Z" />
					</svg>
				)
			default:
				return null
		}
	}

	return (
		<div className={style.btnGrp}>
			{/* Si showButtons est false, affiche uniquement l'icône du thème actuel */}
			{!showButtons && (
				<button onClick={toggleButtons} className={style.btn}>
					{renderIcon(theme)}
				</button>
			)}

			{/* Si showButtons est true, affiche les trois options */}
			{showButtons && (
				<>
					<button onClick={() => handleThemeChange('light')} className={style.btn}>
						{renderIcon('light')}
					</button>
					<button onClick={() => handleThemeChange('dark')} className={style.btn}>
						{renderIcon('dark')}
					</button>
					<button onClick={() => handleThemeChange('system')} className={style.btn}>
						{renderIcon('system')}
					</button>
				</>
			)}
		</div>
	)
}
