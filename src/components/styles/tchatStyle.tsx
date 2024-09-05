const style = {
	// Conteneur de chat
	tchat: 'overflow-hidden overflow-y-scroll pb-4 max-h-screen',

	// Bulles de message envoyées (utilisateur)
	divL: 'flex flex-col items-start mb-1 max-w-tchat mr-auto w-full',
	nomL: 'px-2 my-1 text-sm',
	bubL: 'px-4 py-3 max-w-full rounded-tr-lg rounded-br-lg text-justify bg-org text-acc',
	datL: 'text-xs mt-1 text-right text-acc-bis',

	// Bulles de message reçues (autres utilisateurs)
	divR: 'flex flex-col items-end mb-1 max-w-tchat ml-auto w-full',
	nomR: 'px-2 my-1 text-sm text-right',
	bubR: 'px-4 py-3 max-w-full rounded-tl-lg rounded-bl-lg text-justify bg-tone-bis text-tint',
	datR: 'text-xs mt-1 text-right text-tint-ter',

	// Message en cours d'édition
	msgE: 'text-justify rounded-tl-lg rounded-tr-lg rounded-br-lg resize-none overflow-auto focus:outline-none bg-org',
	bubE: 'flex flex-col w-full px-4 py-3 rounded-tl-lg rounded-br-lg bg-org',

	// Menu contextuel
	menu: 'absolute z-50 px-2 py-1 bg-tone text-tint shadow-custom-menu',
	plat: 'text-sm cursor-pointer',

	// Formulaire de chat
	tchatForm: 'fixed bottom-0 inset-x-0 p-2 px-8 container',
	tchatInput: 'w-full h-auto max-h-64 p-4 pr-20 rounded resize-none overflow-scroll focus:outline-none bg-tone-bis text-tint',
	tchatSend:
		'envoyer w-12 h-12 absolute right-10 -bottom-3 transform -translate-y-1/2 border-0 rounded-md text-transparent transition-opacity duration-150 ease-in-out bg-no-repeat bg-center'
}

export default style
