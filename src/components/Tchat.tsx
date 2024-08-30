import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

export default function Tchat() {
	const messages = useQuery(api.myFunctions.listMessage)
	const sendMessage = useMutation(api.myFunctions.sendMessage)
	const [newMessageText, setNewMessageText] = useState('')
	const { user } = useUser()

	useEffect(() => {
		setTimeout(() => {
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
		}, 0)
	}, [messages])

	return (
		<div className="chat">
			<header>
				<h1>Convex Chat</h1>
				<p>
					Connected as <strong>{user?.username}</strong>
				</p>
			</header>
			{messages?.map(message => (
				<article key={message._id} className={message.author === user?.username ? 'message-mine' : ''}>
					<div>{message.author}</div>

					<p>{message.content}</p>
				</article>
			))}
			<form
				onSubmit={async e => {
					e.preventDefault()
					await sendMessage({ author: user?.id || 'Attends', content: newMessageText })
					setNewMessageText('')
				}}
			>
				<input
					value={newMessageText}
					onChange={async e => {
						const text = e.target.value
						setNewMessageText(text)
					}}
					placeholder="Message..."
				/>
				<button type="submit" disabled={!newMessageText}>
					Envoyer
				</button>
			</form>
		</div>
	)
}
