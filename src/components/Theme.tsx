import { useEffect, useState } from 'react'

export default function Theme() {
	const THEME_KEY = 'theme'
	const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem(THEME_KEY)
		if (savedTheme) return savedTheme
		return prefersDarkMode ? 'dark' : 'light'
	})

	useEffect(() => {
		theme === 'system' ? document.body.classList.toggle('dark', prefersDarkMode) : document.body.classList.toggle('dark', theme === 'dark')
		localStorage.setItem(THEME_KEY, theme)
	}, [theme])

	const handleThemeChange = newTheme => setTheme(newTheme)

	return (
		<>
			<button onClick={() => handleThemeChange('light')}>White</button>
			<button onClick={() => handleThemeChange('dark')}>Black</button>
			<button onClick={() => handleThemeChange('system')}>System</button>
		</>
	)
}
