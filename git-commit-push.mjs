import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

const [, , ...args] = process.argv

if (args.length === 0) {
	console.error('Erreur : Veuillez fournir un message de commit.')
	process.exit(1)
}

const commitMessage = args.join(' ')

const runCommand = async (command, successMessage, errorMessage) => {
	try {
		await execPromise(command)
		console.log(successMessage)
	} catch (error) {
		console.error(`${errorMessage}\n${error.stderr}`)
		process.exit(1)
	}
}

const run = async () => {
	try {
		await runCommand('prettier --write .', 'Fichiers formatés avec Prettier.', 'Erreur lors du formatage avec Prettier.')
		await runCommand('git add .', 'Fichiers ajoutés.', "Erreur lors de l'ajout des fichiers.")
		await runCommand(`git commit -m "${commitMessage}"`, 'Commit effectué.', 'Erreur lors du commit.')
		await runCommand('git push', 'Push effectué.', 'Erreur lors du push.')
	} catch (error) {
		process.exit(1)
	}
}

run()