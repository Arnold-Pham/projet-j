/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				white: 'var(--white)',
				black: 'var(--black)',
				border: 'var(--border)',
				input: 'var(--input)',
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				primary: 'var(--primary)',
				secondary: 'var(--secondary)',
				muted: 'var(--muted)',
				back: 'var(--back)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			maxWidth: {
				tchat: 'var(--tchat-max-width)'
			}
		}
	},
	plugins: [require('tailwindcss-animate')]
}
