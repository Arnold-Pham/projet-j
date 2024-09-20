const style = {
	button: 'bg-tone-bis text-tint flex p-1 rounded-lg',
	svg: 'w-5 h-5 text-tint-bis',

	drawerButton: 'fixed py-3 left-80 top-24 bg-tone-ter text-tint flex rounded-tr rounded-br transform -translate-y-1/2',
	drawerBack: 'fixed inset-0 bg-black opacity-50 md:hidden',
	drawer: 'fixed top-0 left-0 h-full bg-tone-bis text-tint transform transition-transform duration-200 ease-in-out w-80 md:translate-x-0',
	header: 'h-16 bg-tone-ter text-tint mb-1 px-4 flex items-center justify-between',
	title: 'font-semibold font-lg',

	buttonGroup: 'flex gap-1 justify-end items-center',

	modalBack: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-3 w-screen h-screen',
	modal: 'bg-tone-bis p-4 rounded-sm w-96 z-4',
	input: 'w-full h-auto max-h-64 p-2 mt-2 rounded resize-none overflow-scroll focus:outline-none bg-tone-ter text-tint-bis',

	buttonStyle: 'px-2 py-1 rounded focus:outline-none',
	separator: 'mb-4 mt-4 w-3/5 flex mx-auto',
	change: 'cursor-pointer text-center',

	listDiv: 'grpL overflow-hidden overflow-scroll',
	listUl: 'space-y-1 px-2',
	listLi: 'bg-tone-ter p-3 rounded flex items-center justify-between'
}

export default style
