import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'

export default function Tchat() {
	const { user } = useUser()
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const [newMessageText, setNewMessageText] = useState('')
	const sendMessage = useMutation(api.myFunctions.sendMessage)
	const messages = useQuery(api.myFunctions.listMessages, { id: user.id })

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	return (
		<div className="tchat overflow-hidden overflow-y-scroll pb-4">
			{messages?.map(message =>
				message.authorId === user.id ? (
					<div key={message._id} className="max-w-tchat ml-auto flex flex-col items-end mb-2">
						<div className="text-right px-2">{message.author}</div>
						<p className="mt-1 bg-primary text-black px-4 py-3 rounded-tl-lg rounded-tr-lg rounded-bl-lg flex">{message.content}</p>
					</div>
				) : (
					<div key={message._id} className="max-w-tchat mr-auto flex flex-col items-start mb-2">
						<div className="px-2">{message.author}</div>
						<p className="mt-1 bg-foreground text-background px-4 py-3 rounded-tl-lg rounded-tr-lg rounded-br-lg">{message.content}</p>
					</div>
				)
			)}
			<div ref={messagesEndRef} />
			<form
				className="fixed bottom-0 inset-x-0 bg-back container p-2 px-8"
				onSubmit={async e => {
					e.preventDefault()
					await sendMessage({ authorId: user.id, author: user.username, content: newMessageText })
					setNewMessageText('')
				}}
			>
				<input
					className="w-full h-full p-4 rounded-lg bg-foreground text-background"
					value={newMessageText}
					onChange={async e => {
						const text = e.target.value
						setNewMessageText(text)
					}}
					placeholder="Message..."
				/>
				<button
					className="envoyer w-12 h-12 border-0 rounded-md absolute right-12 top-1/2 transform -translate-y-1/2 text-white text-transparent transition-opacity duration-150 ease-in-out bg-no-repeat bg-center"
					type="submit"
					disabled={!newMessageText}
				></button>
			</form>
		</div>
	)
}
