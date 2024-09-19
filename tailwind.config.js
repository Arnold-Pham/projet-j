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
				tone: 'var(--tone-one)',
				'tone-bis': 'var(--tone-bis)',
				'tone-ter': 'var(--tone-ter)',
				tint: 'var(--tint-one)',
				'tint-bis': 'var(--tint-bis)',
				'tint-ter': 'var(--tint-ter)',
				org: 'var(--orange)',
				pur: 'var(--purple)',
				acc: 'var(--acc-one)',
				'acc-bis': 'var(--acc-bis)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			maxWidth: {
				tchat: 'var(--tchat-max-width)'
			},
			boxShadow: {
				'custom-menu': '6px 6px 12px 2px rgba(0, 0, 0, 0.5)'
			},
			zIndex: {
				max: '999'
			}
		}
	},
	plugins: [require('tailwindcss-animate')]
}
