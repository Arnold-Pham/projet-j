const style = {
	listDiv: 'overflow-hidden overflow-scroll',
	list: 'space-y-1 p-1',
	listElem: 'bg-tone-ter p-3 rounded-lg',

	burger: 'bg-tone-ter text-tint flex p-1 items-center rounded-lg',
	drawer: 'fixed top-0 left-0 h-full bg-tone-bis text-tint transform transition-transform duration-200 ease-in-out z-40 w-full sm:w-96',
	head: 'h-16 bg-tone-ter text-tint',
	header: 'h-16 p-4 flex items-center justify-between',
	close: 'bg-tone-bis text-tint flex p-1 items-center rounded-lg',

	form: 'fixed bottom-0 inset-x-0 p-2 px-8 container',
	input: 'w-full h-auto max-h-64 p-2 pr-10 rounded resize-none overflow-scroll focus:outline-none bg-tone-ter text-tint-bis',
	button: 'envoyer w-12 h-12 absolute right-7 -bottom-5 transform -translate-y-1/2 border-0 rounded-md text-transparent transition-opacity duration-150 ease-in-out bg-no-repeat bg-center',

	back: 'fixed inset-0 bg-black opacity-50 z-30'
}

export default style
