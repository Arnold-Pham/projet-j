export default function Notification({ id, success, message, close }: { id: number; success: number; message: string; close: () => void }) {
	return (
		<div key={id} className={success === 0 ? style.non : style.oui} onClick={close}>
			{success === 3 ? <div dangerouslySetInnerHTML={{ __html: message }} /> : message}
		</div>
	)
}

const style = {
	oui: 'p-4 rounded-md shadow-lg border cursor-pointer bg-green-200 text-green-700 border-green-700',
	non: 'p-4 rounded-md shadow-lg border cursor-pointer bg-red-200 text-red-700 border-red-700'
}
