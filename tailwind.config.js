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
				background: 'var(--background-color)',
				text: 'var(--text-color)',
				'chat-sent': 'var(--chat-sent-background)',
				'chat-received': 'var(--chat-received-background)',
				'chat-sent-text': 'var(--chat-sent-text-color)',
				'chat-received-text': 'var(--chat-received-text-color)'
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
