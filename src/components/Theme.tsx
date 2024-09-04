import { useEffect, useState } from 'react'
import img1 from '../images/Sun.svg'
import img2 from '../images/Moon.svg'
import img3 from '../images/Computer.svg'
import style from './styles/themeStyle'

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
		<div className={style.btnGrp}>
			<button onClick={() => handleThemeChange('light')} className={style.btn}>
				<img src={img1} alt="Light mode" />
			</button>
			<button onClick={() => handleThemeChange('dark')} className={style.btn}>
				<img src={img2} alt="Dark mode" />
			</button>
			<button onClick={() => handleThemeChange('system')} className={style.btn}>
				<img src={img3} alt="System mode" />
			</button>
		</div>
	)
}
