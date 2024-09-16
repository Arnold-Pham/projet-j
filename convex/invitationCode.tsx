import { MutationCtx } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'

const generateCode = async (ctx: MutationCtx, length: number = 8): Promise<string> => {
	const charset = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789'
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
		creatorId: v.string(),
		maxUses: v.optional(v.number()),
		expiresAt: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const codeGen = await generateCode(ctx)

		await ctx.db.insert('invitationCode', {
			groupId: args.groupId,
			creatorId: args.creatorId,
			code: codeGen,
			currentUses: 0,
			maxUses: args.maxUses,
			expiresAt: args.expiresAt
		})
	}
})
