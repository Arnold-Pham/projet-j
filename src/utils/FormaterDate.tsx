export default function formaterDate(milliseconds: number): string {
	const date = new Date(milliseconds)
	const maintenant = new Date()
	const dateFormat = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
	const tempsFormat = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: undefined, hour12: false })

	const debutJour = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate())
	const estAujourdHui = date >= debutJour && date.getTime() < debutJour.getTime() + 24 * 60 * 60 * 1000
	if (estAujourdHui) return `Aujourd'hui ${tempsFormat}`

	const debutHier = new Date(debutJour.getTime() - 24 * 60 * 60 * 1000)
	const estHier = date >= debutHier && date < debutJour
	if (estHier) return `Hier ${tempsFormat}`

	return `${dateFormat} ${tempsFormat}`
}
