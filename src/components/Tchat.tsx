import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../convex/_generated/api'
import formaterDate from '../utils/FormaterDate'
import { useUser } from '@clerk/clerk-react'
import style from '../styles/tchatStyle'

export default function Tchat({ groupId, groupName }: { groupId: string; groupName: string }) {
	const { user } = useUser() // Récupère l'utilisateur connecté
	const [edit, setEdit] = useState('') // ID du message à éditer
	const [newMsgText, setNewMsgText] = useState('') // Texte du nouveau message
	const [editMsgText, setEditMsgText] = useState('') // Contenu du message édité
	const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageId: string } | null>(null) // Infos du menu clic droit

	//	Références pour le défilement automatique
	const lastMsgRef = useRef<HTMLDivElement>(null)
	const editMsgRef = useRef<HTMLTextAreaElement>(null)
	const sendMsgRef = useRef<HTMLTextAreaElement>(null)

	//	Fonctions pour les messages
	const sendMessage = useMutation(api.message.sendMessage)
	const deleteMessage = useMutation(api.message.deleteMessage)
	const updateMessage = useMutation(api.message.updateMessage)
	const messages = useQuery(api.message.listMessages, { groupId })

	//	Ajuste la hauteur du textarea
	const autoHeight = (textarea: HTMLTextAreaElement) => {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
	}

	//	Supprime un message
	const handleDeleteMessage = async (messageId: string) => {
		await deleteMessage({ messageId: messageId })
		setContextMenu(null)
	}

	//	Envoie un message avec vérifications
	const handleSendMessage = async (e: any) => {
		e.preventDefault()
		if (newMsgText.trim() !== '') {
			await sendMessage({
				groupId: groupId,
				group: groupName,
				userId: user?.id || '',
				user: user?.username || '',
				content: newMsgText.trim()
			})
			setNewMsgText('')
			autoHeight(sendMsgRef.current)
		}
	}

	//	Gère la touche "Enter" pour l'envoi
	const handleSendClavier = (e: any) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			e.currentTarget.form.requestSubmit()
		}
	}

	//	Édite un message avec vérifications / Supprime un message si le champ est vide
	const handleEditSubmit = async (e: any, messageId: string) => {
		e.preventDefault()
		const message = messages?.find(msg => msg._id === messageId)
		const trimmedText = editMsgText.trim()

		if (trimmedText !== message?.content && trimmedText !== '') {
			await updateMessage({ messageId: messageId, content: trimmedText })
		} else if (trimmedText === '') {
			await handleDeleteMessage(messageId)
		}

		setEditMsgText('')
		setEdit('')
	}

	//	Gère les touches "Enter" et "Échap" pour l'édition
	const handleEditClavier = (e: any) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			e.currentTarget.form.requestSubmit()
		} else if (e.key === 'Escape') {
			e.preventDefault()
			setEditMsgText('')
			setEdit('')
		}
	}

	//	Crée le menu clic droit
	const handleMessageContextMenu = (e: any) => {
		e.preventDefault()
		setContextMenu({
			x: e.pageX,
			y: e.pageY,
			messageId: e.currentTarget.dataset.messageId
		})
	}

	//	Gère les éléments du menu clic droit
	const handleMenuItemClick = (action: any) => {
		if (contextMenu) {
			if (action === 'edit') {
				setEdit(contextMenu.messageId)
				const messageToEdit = messages?.find(msg => msg._id === contextMenu.messageId)
				if (messageToEdit) setEditMsgText(messageToEdit.content)
			} else if (action === 'delete') handleDeleteMessage(contextMenu.messageId)
			setContextMenu(null)
		}
	}

	//	Gère la fermeture du menu clic droit
	useEffect(() => {
		document.addEventListener('contextmenu', e => e.preventDefault())
		document.addEventListener('click', () => setContextMenu(null))
		return () => {
			document.removeEventListener('contextmenu', e => e.preventDefault())
			document.removeEventListener('click', () => setContextMenu(null))
		}
	}, [])

	//	Focus sur la zone d'édition
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

	//	Défilement vers le nouveau message
	useEffect(() => {
		if (lastMsgRef.current) {
			lastMsgRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	//	Ajuste la hauteur du champ d'envoi
	useEffect(() => {
		if (sendMsgRef.current) autoHeight(sendMsgRef.current)
	}, [newMsgText])

	//	Ajuste la hauteur du champ d'édition
	useEffect(() => {
		if (editMsgRef.current) autoHeight(editMsgRef.current)
	}, [editMsgText])

	return (
		<div className={`tchat ${style.tchat}`}>
			{messages?.map((message, index) => {
				const isSameAuthorAsPrev = index > 0 && messages[index - 1].userId === message.userId

				return message.userId === user?.id ? (
					<div key={message._id} className={style.divL}>
						{!isSameAuthorAsPrev && <p className={style.nomL}>{message.user}</p>}

						{edit === message._id ? (
							<form
								onSubmit={e => handleEditSubmit(e, message._id)}
								className={!isSameAuthorAsPrev ? style.bubE + ' rounded-tr-lg' : style.bubE}
							>
								<textarea
									rows={1}
									ref={editMsgRef}
									value={editMsgText}
									className={style.msgE}
									onKeyDown={handleEditClavier}
									onChange={e => setEditMsgText(e.target.value)}
								/>
								<p className={style.datL}>{formaterDate(message._creationTime)}</p>
								<button type="submit" hidden></button>
							</form>
						) : (
							<div
								data-message-id={message._id}
								onContextMenu={handleMessageContextMenu}
								className={!isSameAuthorAsPrev ? style.bubL + ' rounded-tl-lg' : style.bubL}
							>
								<p>{message.content}</p>
								<p className={style.datL}>{formaterDate(message._creationTime)}</p>
							</div>
						)}
					</div>
				) : (
					<div key={message._id} className={style.divR}>
						{!isSameAuthorAsPrev && <p className={style.nomR}>{message.user}</p>}
						<div className={!isSameAuthorAsPrev ? style.bubR + ' rounded-tr-lg' : style.bubR}>
							<p>{message.content}</p>
							<p className={style.datR}>{formaterDate(message._creationTime)}</p>
						</div>
					</div>
				)
			})}

			<div ref={lastMsgRef} />

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

			<form className={style.tchatForm} onSubmit={handleSendMessage}>
				<textarea
					required
					rows={1}
					ref={sendMsgRef}
					value={newMsgText}
					placeholder="Message..."
					className={style.tchatInput}
					onKeyDown={handleSendClavier}
					onChange={e => setNewMsgText(e.target.value)}
				/>
				<button className={style.tchatSend} type="submit" disabled={!newMsgText.trim()}></button>
			</form>
		</div>
	)
}
