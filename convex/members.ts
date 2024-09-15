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

export const listMembers = query({
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
		const member = await ctx.db
			.query('member')
			.filter(q => q.and(q.eq(q.field('groupId'), args.groupId), q.eq(q.field('userId'), args.userId)))
			.collect()
		await ctx.db.delete(member[0]._id)
	}
})
