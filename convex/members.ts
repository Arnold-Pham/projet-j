import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const addMember = mutation({
	args: {
		groupId: v.string(),
		group: v.string(),
		userId: v.string(),
		user: v.string(),
		role: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('members', {
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
			.query('members')
			.filter(q => q.eq(q.field('groupId'), args.groupId))
			.collect()
	}
})

export const changeRole = mutation({
	args: {
		memberId: v.id('members'),
		role: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.memberId, { role: args.role })
	}
})

export const deleteMember = mutation({
	args: {
		memberId: v.id('members')
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.memberId)
	}
})
