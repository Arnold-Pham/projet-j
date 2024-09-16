import { MutationCtx } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'

const generateCode = async (ctx: MutationCtx, length: number = 8): Promise<string> => {
	const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'
	let isUnique = false
	let code = ''

	while (!isUnique) {
		code = ''
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length)
			code += charset[randomIndex]
		}

		const existingCode = await ctx.db
			.query('invitationCode')
			.filter((q: any) => q.eq('code', code))
			.first()

		if (!existingCode) isUnique = true
	}

	return code
}

export const createCode = mutation({
	args: {
		groupId: v.id('group'),
		group: v.string(),
		creatorId: v.string(),
		maxUses: v.optional(v.number()),
		expiresAt: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const codeGen = await generateCode(ctx)

		await ctx.db.insert('invitationCode', {
			groupId: args.groupId,
			group: args.group,
			creatorId: args.creatorId,
			code: codeGen,
			currentUses: 0,
			maxUses: args.maxUses,
			expiresAt: args.expiresAt
		})
	}
})

export const useCode = mutation({
	args: {
		code: v.string(),
		userId: v.string(),
		user: v.string()
	},
	handler: async (ctx, args) => {
		const invitationCode = await ctx.db
			.query('invitationCode')
			.filter(q => q.eq(q.field('code'), args.code))
			.first()

		if (!invitationCode) return { success: false, message: "Code d'invitation invalide." }

		const { maxUses, currentUses, expiresAt } = invitationCode

		if (maxUses !== undefined && maxUses > 0 && currentUses >= maxUses)
			return { success: false, message: "Le code d'invitation a atteint le nombre maximum d'utilisations." }

		if (expiresAt !== undefined && expiresAt < Date.now()) return { success: false, message: "Le code d'invitation a expiré." }

		await ctx.db.insert('member', {
			groupId: invitationCode.groupId,
			group: invitationCode.group,
			userId: args.userId,
			user: args.user,
			role: 'member'
		})

		await ctx.db.patch(invitationCode._id, { currentUses: invitationCode.currentUses + 1 })

		return { success: true, message: "Code d'invitation valide et membre ajouté avec succès." }
	}
})
