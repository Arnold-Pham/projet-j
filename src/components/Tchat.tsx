// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { useEffect, useRef, useState } from 'react'

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
			{messages?.map(message =>
				message.author === user?.id ? (
					<article key={message._id} className="moi">
						<div>{user?.username}</div>
						<p>{message.content}</p>
					</article>
				) : (
					<></>
					// <article key={message._id} className="grid grid-cols-2 mx-auto my-6 max-w-[380px] animate-message box-border">
					// 	<div className="font-medium text-primary-text">{user?.username}</div>
					// 	<p className="text-secondary-text bg-bubbles-background mb-4 py-5 px-4 rounded-l-lg shadow-md text-ellipsis leading-relaxed col-span-2 justify-self-start whitespace-pre-line relative">
					// 		{message.content}
					// 	</p>
					// </article>
				)
			)}
			<div ref={messagesEndRef} />
			<form
				onSubmit={async e => {
					e.preventDefault()
					await sendMessage({ author: user?.id || 'Attends', content: newMessageText })
					setNewMessageText('')
				}}
				className="fixed bottom-0"
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
