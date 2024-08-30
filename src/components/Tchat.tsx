import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'

export default function Tchat() {
	const { user } = useUser()
	const messages = useQuery(api.myFunctions.listMessage, { id: user?.id || '' })
	const sendMessage = useMutation(api.myFunctions.sendMessage)
	const [newMessageText, setNewMessageText] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	return (
		<div className="chat">
			{messages?.map(message => (
				<article key={message._id} className={(message.author === user?.id ? 'moi' : '') + ' chat-article'}>
					<div className="chat-name">{user?.username}</div>
					<p className="chat-message">{message.content}</p>
				</article>
			))}
			<div ref={messagesEndRef} />
			<form
				className="chat-form"
				onSubmit={async e => {
					e.preventDefault()
					await sendMessage({ author: user?.id || 'Attends', content: newMessageText })
					setNewMessageText('')
				}}
			>
				<input
					className="chat-input"
					value={newMessageText}
					onChange={async e => {
						const text = e.target.value
						setNewMessageText(text)
					}}
					placeholder="Message..."
				/>
				<button className="chat-button" type="submit" disabled={!newMessageText}>
					Envoyer
				</button>
			</form>
		</div>
	)
}
