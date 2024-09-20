import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const addMember = mutation({
	args: {
		groupId: v.id('group'),
		group: v.string(),
		userId: v.string(),
		user: v.string(),
		role: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('member', {
			groupId: args.groupId,
			group: args.group,
			userId: args.userId,
			user: args.user,
			role: args.role
		})
	}
})

export const listMembers = mutation({
	args: {
		groupId: v.string()
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query('member')
			.filter(q => q.eq(q.field('groupId'), args.groupId))
			.collect()
	}
})

export const changeRole = mutation({
	args: {
		memberId: v.id('member'),
		role: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.memberId, { role: args.role })
	}
})

export const deleteMember = mutation({
	args: {
		groupId: v.id('group'),
		userId: v.string()
	},
	handler: async (ctx, args) => {
		const { groupId } = args

		const membre = await ctx.db
			.query('member')
			.filter(q => q.and(q.eq(q.field('groupId'), groupId), q.eq(q.field('userId'), args.userId)))
			.first()

		const members = await ctx.db
			.query('member')
			.filter(q => q.eq(q.field('groupId'), groupId))
			.collect()

		if (members.length > 1 && membre) {
			await ctx.db.delete(membre._id)
			return { success: 1, message: 'Vous avez quitté le groupe' }
		}

		const messages = await ctx.db
			.query('message')
			.filter(q => q.eq(q.field('groupId'), groupId))
			.collect()

		const codes = await ctx.db
			.query('invitationCode')
			.filter(q => q.eq(q.field('groupId'), groupId))
			.collect()

		for (const message of messages) await ctx.db.delete(message._id)
		for (const member of members) await ctx.db.delete(member._id)
		for (const code of codes) await ctx.db.delete(code._id)

		await ctx.db.delete(groupId)
		return { success: 1, message: 'Vous avez quitté le groupe et il a été supprimé car vous étiez le dernier membre' }
	}
})
