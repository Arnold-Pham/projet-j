import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'

export default function Tchat() {
	const { user } = useUser()
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [newMessageText, setNewMessageText] = useState('')
	const sendMessage = useMutation(api.myFunctions.sendMessage)
	const deleteMessage = useMutation(api.myFunctions.deleteMessage)
	const messages = useQuery(api.myFunctions.listMessages, { id: user.id })
	const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageId: string } | null>(null)

	const handleClickOutside = () => {
		setContextMenu(null)
	}

	document.addEventListener('contextmenu', e => {
		e.preventDefault()
	})

	useEffect(() => {
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

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
						<p
							className="mt-1 bg-primary text-black px-4 py-3 rounded-tl-lg rounded-tr-lg rounded-bl-lg flex"
							onContextMenu={e => {
								setContextMenu({ x: e.pageX, y: e.pageY, messageId: message._id })
							}}
						>
							{message.content}
						</p>
					</div>
				) : (
					<div key={message._id} className="max-w-tchat mr-auto flex flex-col items-start mb-2">
						<div className="px-2">{message.author}</div>
						<p className="mt-1 bg-foreground text-background px-4 py-3 rounded-tl-lg rounded-tr-lg rounded-br-lg">{message.content}</p>
					</div>
				)
			)}
			<div ref={messagesEndRef} />

			{contextMenu && (
				<ul className="absolute bg-white shadow-lg border rounded-lg z-50" style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
					<li className="px-2 py-1 text-sm cursor-pointer text-black" onClick={() => console.log(contextMenu.messageId)}>
						Modifier
					</li>
					<li className="px-2 py-1 text-sm cursor-pointer text-black" onClick={() => handleDeleteMessage(contextMenu.messageId)}>
						Supprimer
					</li>
				</ul>
			)}

			<form
				className="fixed bottom-0 inset-x-0 bg-back container p-2 px-8"
				onSubmit={async e => {
					e.preventDefault()
					await sendMessage({ authorId: user.id, author: user.username, content: newMessageText })
					setNewMessageText('')
					textareaRef.current.style.height = 'auto'
				}}
			>
				<textarea
					ref={textareaRef}
					className="w-full h-auto max-h-64 p-4 pr-20 rounded-lg bg-foreground text-background resize-none overflow-hidden focus:outline-none"
					value={newMessageText}
					onChange={async e => {
						const text = e.target.value
						setNewMessageText(text)
						e.target.style.height = 'auto'
						e.target.style.height = `${e.target.scrollHeight}px`
					}}
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
					disabled={!newMessageText}
				></button>
			</form>
		</div>
	)
}
