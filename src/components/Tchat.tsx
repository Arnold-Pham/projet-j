import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'

export default function Tchat() {
	const { user } = useUser()
	const [edit, setEdit] = useState('') // ID du message en cours d'édition
	const messagesEndRef = useRef<HTMLDivElement>(null) // Réf pour le scroll vers la fin des messages
	const editAreaRef = useRef<HTMLTextAreaElement>(null) // Réf pour le textarea en mode édition
	const textAreaRef = useRef<HTMLTextAreaElement>(null) // Réf pour le textarea du nouveau message
	const [newMessageText, setNewMessageText] = useState('') // Nouveau message texte
	const [editMessageText, setEditMessageText] = useState('') // Contenu du message édité
	const sendMessage = useMutation(api.myFunctions.sendMessage) // Fonction d'envoi de message
	const deleteMessage = useMutation(api.myFunctions.deleteMessage) // Fonction de suppression de message
	const updateMessage = useMutation(api.myFunctions.updateMessage) // Fonction de mise à jour du message
	const messages = useQuery(api.myFunctions.listMessages, { id: user.id }) // Requête pour les messages
	const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageId: string } | null>(null) // Mise en place du menu clic droit

	// Gestion de la fermeture du menu contextuel
	const handleClickOutside = () => {
		setContextMenu(null)
	}

	// Empêcher l'ouverture du menu contextuel natif du navigateur
	document.addEventListener('contextmenu', e => {
		e.preventDefault()
	})

	useEffect(() => {
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	// Focus automatique et positionnement du curseur à la fin du texte lors de l'édition
	useEffect(() => {
		if (edit && editAreaRef.current) {
			editAreaRef.current.focus()
			const length = editAreaRef.current.value.length
			editAreaRef.current.setSelectionRange(length, length) // Placer le curseur à la fin du texte
		}
	}, [edit])

	// Scroll automatique vers le bas des messages lors de la mise à jour
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	// Ajuster dynamiquement la hauteur du textarea
	const adjustTextAreaHeight = (textarea: HTMLTextAreaElement) => {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
	}

	useEffect(() => {
		if (editAreaRef.current) {
			adjustTextAreaHeight(editAreaRef.current)
		}
	}, [editMessageText])

	useEffect(() => {
		if (textAreaRef.current) {
			adjustTextAreaHeight(textAreaRef.current)
		}
	}, [newMessageText])

	// Gestion de la suppression de message
	const handleDeleteMessage = async (messageId: string) => {
		await deleteMessage({ id: messageId })
		setContextMenu(null)
	}

	return (
		<div className="tchat overflow-hidden overflow-y-scroll pb-4">
			{messages?.map(message =>
				message.authorId === user.id ? (
					<div key={message._id} className="max-w-tchat ml-auto flex flex-col items-end mb-2">
						<div className="text-right px-2">{message.author}</div>
						{edit === message._id ? (
							// Mode édition
							<form
								className="w-full"
								onSubmit={async e => {
									e.preventDefault()
									if (editMessageText.trim() === message.content) {
										setEdit('')
									} else if (editMessageText.trim() === '' && editMessageText.trim() !== message.content) {
										handleDeleteMessage(message._id)
									} else {
										await updateMessage({ id: message._id, content: editMessageText.trim() })
										setEditMessageText('')
										setEdit('')
									}
								}}
							>
								<textarea
									ref={editAreaRef} // Référence pour le focus
									className="w-full h-auto max-h-64 min-h-5 p-4 rounded-tl-lg rounded-tr-lg rounded-bl-lg bg-primary text-background resize-none overflow-scroll focus:outline-none"
									value={editMessageText}
									onChange={e => {
										setEditMessageText(e.target.value)
									}}
									onKeyDown={e => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault()
											e.target.form.requestSubmit()
										} else if (e.key === 'Escape') {
											setEditMessageText('') // Annuler la modification
											setEdit('')
										}
									}}
									rows={1}
								/>
								<button type="submit" hidden></button>
							</form>
						) : (
							// Affichage normal du message
							<p
								className="mt-1 bg-primary text-black px-4 py-3 rounded-tl-lg rounded-tr-lg rounded-bl-lg flex"
								onContextMenu={e => {
									setContextMenu({ x: e.pageX, y: e.pageY, messageId: message._id })
								}}
							>
								{message.content}
							</p>
						)}
					</div>
				) : (
					// Messages d'autres utilisateurs
					<div key={message._id} className="max-w-tchat mr-auto flex flex-col items-start mb-2">
						<div className="px-2">{message.author}</div>
						<p className="mt-1 bg-foreground text-background px-4 py-3 rounded-tl-lg rounded-tr-lg rounded-br-lg">{message.content}</p>
					</div>
				)
			)}
			<div ref={messagesEndRef} />

			{/* Menu contextuel pour modifier ou supprimer un message */}
			{contextMenu && (
				<ul className="absolute bg-white shadow-lg border rounded-lg z-50" style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
					<li
						className="px-2 py-1 text-sm cursor-pointer text-black"
						onClick={() => {
							setEdit(contextMenu.messageId)
							const messageToEdit = messages.find(msg => msg._id === contextMenu.messageId)
							if (messageToEdit) {
								setEditMessageText(messageToEdit.content)
							}
						}}
					>
						Modifier
					</li>
					<li className="px-2 py-1 text-sm cursor-pointer text-black" onClick={() => handleDeleteMessage(contextMenu.messageId)}>
						Supprimer
					</li>
				</ul>
			)}

			{/* Formulaire pour envoyer un nouveau message */}
			<form
				className="fixed bottom-0 inset-x-0 bg-back container p-2 px-8"
				onSubmit={async e => {
					e.preventDefault()
					await sendMessage({ authorId: user.id, author: user.username, content: newMessageText.trim() })
					setNewMessageText('')
					textAreaRef.current.style.height = 'auto'
				}}
			>
				<textarea
					ref={textAreaRef}
					className="w-full h-auto max-h-64 p-4 pr-20 rounded-lg bg-foreground text-background resize-none overflow-scroll focus:outline-none"
					value={newMessageText}
					onChange={e => setNewMessageText(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault()
							e.target.form.requestSubmit()
						}
					}}
					placeholder="Message..."
					rows={1}
				/>
				<button
					className="envoyer w-12 h-12 border-0 rounded-md absolute right-12 -bottom-3 transform -translate-y-1/2 text-white text-transparent transition-opacity duration-150 ease-in-out bg-no-repeat bg-center"
					type="submit"
					disabled={!newMessageText.trim()}
				></button>
			</form>
		</div>
	)
}
