import { useEffect, useState } from 'react'
import img1 from '../images/Sun.svg'
import img2 from '../images/Moon.svg'
import img3 from '../images/Computer.svg'

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
			<button onClick={() => handleThemeChange('light')} className="bg-white w-8 h-8 p-1 flex align-center justify-center">
				<img src={img1} alt="Light mode" />
			</button>
			<button onClick={() => handleThemeChange('dark')} className="bg-white w-8 h-8 p-1 flex align-center justify-center">
				<img src={img2} alt="Dark mode" />
			</button>
			<button onClick={() => handleThemeChange('system')} className="bg-white w-8 h-8 p-1 flex align-center justify-center">
				<img src={img3} alt="System mode" />
			</button>
		</>
	)
}
