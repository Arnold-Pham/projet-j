const style = {
	//	GroupList
	listDiv: 'grp overflow-hidden overflow-scroll',
	listUl: 'space-y-1 px-2',
	listLi: 'bg-tone-ter p-3 rounded flex items-center justify-between',

	modalBack: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-screen h-screen',
	modal: 'bg-tone-bis p-4 rounded-sm w-96 z-60',
	title: 'font-semibold font-lg mb-2',

	btnGrp: 'flex gap-1 justify-end',
	btnAction: 'bg-tone-bis text-tint rounded focus:outline-none p-1',
	btnCreate: 'bg-green-800 text-white px-2 py-1 rounded focus:outline-none',
	btnLeave: 'bg-red-800 text-white px-2 py-1 rounded focus:outline-none',
	btnCancel: 'bg-tone-ter px-2 py-1 rounded focus:outline-none',

	//	GroupSelect
	burger: 'bg-tone-ter text-tint flex p-1 items-center rounded-lg',
	drawer: 'fixed top-0 left-0 h-full bg-tone-bis text-tint transform transition-transform duration-200 ease-in-out z-40 w-full sm:w-96',
	header: 'h-16 bg-tone-ter text-tint mb-1 px-4 flex items-center justify-between',
	head: 'font-semibold font-lg',
	close: 'bg-tone-bis text-tint flex p-1 items-center rounded-lg',

	input: 'w-full h-auto max-h-64 p-2 mt-2 rounded resize-none overflow-scroll focus:outline-none bg-tone-ter text-tint-bis',
	btnFormGrp: 'mt-2 flex gap-1 justify-end',
	back: 'fixed inset-0 bg-black opacity-50 z-30'
}

export default style
