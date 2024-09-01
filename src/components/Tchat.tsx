import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'

export default function Tchat() {
	const { user } = useUser() // Récupère User connecté
	const [edit, setEdit] = useState('') // ID message à éditer
	const [newMsgText, setNewMsgText] = useState('') // Nouveau message texte
	const [editMsgText, setEditMsgText] = useState('') // Contenu du message édité
	const messages = useQuery(api.myFunctions.listMessages, { id: user.id }) // Requête 100 derniers messages
	const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageId: string } | null>(null) // Infos menu clic droit

	// Balises références
	const lastMsgRef = useRef<HTMLDivElement>(null)
	const editMsgRef = useRef<HTMLTextAreaElement>(null)
	const sendMsgRef = useRef<HTMLTextAreaElement>(null)

	// Gère fonctions externes messages
	const sendMessage = useMutation(api.myFunctions.sendMessage)
	const deleteMessage = useMutation(api.myFunctions.deleteMessage)
	const updateMessage = useMutation(api.myFunctions.updateMessage)

	/**
	 * Ajuste hauteur textarea
	 * @param textarea
	 */
	const autoHeight = (textarea: HTMLTextAreaElement) => {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
	}

	/**
	 * Supprime message
	 * @param messageId ID message ciblé
	 */
	const handleDeleteMessage = async (messageId: string) => {
		await deleteMessage({ id: messageId })
		setContextMenu(null)
	}

	/**
	 * Envoi message avec vérifications
	 * @param e Évènements
	 */
	const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (newMsgText.trim() !== '') await sendMessage({ authorId: user.id, author: user.username, content: newMsgText.trim() })
		setNewMsgText('')
		autoHeight(sendMsgRef.current)
	}

	/**
	 * Gère touche "Enter" envoi
	 * @param e Évènements
	 */
	const handleSendClavier = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			e.currentTarget.form?.requestSubmit()
		}
	}

	/**
	 * Édition message avec vérifications / Supprime message si champ vide
	 * @param e Évènements
	 * @param messageId ID message ciblé
	 */
	const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>, messageId: string) => {
		e.preventDefault()
		const message = messages.find(msg => msg._id === messageId)
		const trimmedText = editMsgText.trim()

		if (trimmedText !== message.content && trimmedText !== '') {
			await updateMessage({ id: messageId, content: trimmedText })
		} else if (trimmedText === '') {
			await handleDeleteMessage(messageId)
		}
		setEditMsgText('')
		setEdit('')
	}

	/**
	 * Gère touche "Enter" et "Échap" edit
	 * @param e Évènements
	 */
	const handleEditClavier = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			e.currentTarget.form?.requestSubmit()
		} else if (e.key === 'Escape') {
			e.preventDefault()
			setEditMsgText('')
			setEdit('')
		}
	}

	/**
	 * Crée menu clic droit
	 * @param e Évènements
	 */
	const handleMessageContextMenu = (e: React.MouseEvent<HTMLParagraphElement>) => {
		e.preventDefault()
		setContextMenu({ x: e.pageX, y: e.pageY, messageId: e.currentTarget.dataset.messageId || '' })
	}

	/**
	 * Gère éléments menu clic droit
	 * @param action "edit" | "delete"
	 */
	const handleMenuItemClick = (action: 'edit' | 'delete') => {
		if (contextMenu) {
			if (action === 'edit') {
				setEdit(contextMenu.messageId)
				const messageToEdit = messages.find(msg => msg._id === contextMenu.messageId)
				if (messageToEdit) setEditMsgText(messageToEdit.content)
			} else if (action === 'delete') {
				handleDeleteMessage(contextMenu.messageId)
			}
			setContextMenu(null)
		}
	}

	/**
	 * Gère fermeture menu clic droit
	 */
	useEffect(() => {
		document.addEventListener('contextmenu', e => e.preventDefault())
		document.addEventListener('click', () => setContextMenu(null))
		return () => {
			document.removeEventListener('contextmenu', e => e.preventDefault())
			document.addEventListener('click', () => setContextMenu(null))
		}
	}, [])

	/**
	 * Focus zone edit
	 */
	useEffect(() => {
		if (edit && editMsgRef.current) {
			const textarea = editMsgRef.current
			textarea.focus()
			textarea.setSelectionRange(textarea.value.length, textarea.value.length)
			autoHeight(textarea)

			const rect = textarea.getBoundingClientRect()
			const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight

			if (!isInView) textarea.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
		}
	}, [edit])

	/**
	 * Scroll vers nouveau message
	 */
	useEffect(() => {
		if (lastMsgRef.current) {
			lastMsgRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	/**
	 * Ajuste hauteur champ envoi
	 */
	useEffect(() => {
		if (sendMsgRef.current) autoHeight(sendMsgRef.current)
	}, [newMsgText])

	/**
	 * Ajuste hauteur champ edit
	 */
	useEffect(() => {
		if (editMsgRef.current) autoHeight(editMsgRef.current)
	}, [editMsgText])

	// Rendu du composant
	return (
		<div className={`tchat ${style.tchat}`}>
			{/* Affichage messages */}
			{messages?.map(message =>
				message.authorId === user.id ? (
					<div key={message._id} className={style.bulleLeft}>
						<div className={style.nomLeft}>{message.author}</div>

						{/* Affichage editeur ou message normal */}
						{edit === message._id ? (
							<form className="w-full" onSubmit={e => handleEditSubmit(e, message._id)}>
								<textarea
									ref={editMsgRef}
									className={style.msgEdit}
									value={editMsgText}
									onChange={e => setEditMsgText(e.target.value)}
									onKeyDown={handleEditClavier}
									rows={1}
								/>
								<button type="submit" hidden></button>
							</form>
						) : (
							<p className={style.msgLeft} data-message-id={message._id} onContextMenu={handleMessageContextMenu}>
								{message.content}
							</p>
						)}
					</div>
				) : (
					<div key={message._id} className={style.bulleRight}>
						<div className={style.nomRight}>{message.author}</div>
						<p className={style.msgRight}>{message.content}</p>
					</div>
				)
			)}

			{/* Ref pour descendre au dernier message envoyé/reçu */}
			<div ref={lastMsgRef} />

			{/* Menu clic droit */}
			{contextMenu && (
				<ul className={style.menu} style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
					<li className={style.plat} onClick={() => handleMenuItemClick('edit')}>
						Modifier
					</li>
					<li className={style.plat} onClick={() => handleMenuItemClick('delete')}>
						Supprimer
					</li>
				</ul>
			)}

			{/* Formulaire d'envoi de messages */}
			<form className={style.tchatForm} onSubmit={handleSendMessage}>
				<textarea
					ref={sendMsgRef}
					className={style.tchatInput}
					value={newMsgText}
					onChange={e => setNewMsgText(e.target.value)}
					onKeyDown={handleSendClavier}
					placeholder="Message..."
					rows={1}
				/>
				<button className={style.tchatSend} type="submit" disabled={!newMsgText.trim()}></button>
			</form>
		</div>
	)
}

/**
 * Tout le style de la page
 */
const style = {
	tchat: 'overflow-hidden overflow-y-scroll pb-4',

	bulleLeft: 'max-w-tchat mr-auto flex flex-col items-start mb-2',
	nomLeft: 'px-2 text-text',
	msgLeft: 'mt-1 bg-chat-sent text-chat-sent-text px-4 py-3 rounded-tl-lg rounded-tr-lg rounded-br-lg',

	msgEdit:
		'w-full h-auto max-h-64 min-h-5 p-4 rounded-tl-lg rounded-tr-lg rounded-bl-lg bg-primary text-background resize-none overflow-scroll focus:outline-none',

	bulleRight: 'max-w-tchat ml-auto flex flex-col items-end mb-2',
	nomRight: 'text-right px-2 text-text',
	msgRight: 'mt-1 bg-chat-received text-chat-received-text px-4 py-3 rounded-tl-lg rounded-tr-lg rounded-bl-lg flex',

	menu: 'absolute bg-white shadow-lg border rounded-lg z-50',
	plat: 'px-2 py-1 text-sm cursor-pointer text-black',

	tchatForm: 'fixed bottom-0 inset-x-0 bg-background container p-2 px-8',
	tchatInput: 'w-full h-auto max-h-64 p-4 pr-20 rounded-lg bg-chat-received text-chat-received-text resize-none overflow-scroll focus:outline-none',
	tchatSend:
		'envoyer w-12 h-12 border-0 rounded-md absolute right-12 -bottom-3 transform -translate-y-1/2 text-transparent transition-opacity duration-150 ease-in-out bg-no-repeat bg-center'
}
