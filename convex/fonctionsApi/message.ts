import { query, mutation } from '../_generated/server'
import { v } from 'convex/values'

export const sendMessage = mutation({
	args: {
		groupId: v.string(),
		group: v.string(),
		userId: v.string(),
		user: v.string(),
		content: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('message', {
			groupId: args.groupId,
			group: args.group,
			userId: args.userId,
			user: args.user,
			content: args.content
		})
	}
})

export const listMessages = query({
	args: {
		groupId: v.string()
	},
	handler: async (ctx, args) => {
		const msgs = await ctx.db
			.query('message')
			.filter(q => q.eq(q.field('groupId'), args.groupId))
			.order('desc')
			.take(100)
		return msgs.reverse()
	}
})

export const updateMessage = mutation({
	args: {
		messageId: v.id('message'),
		content: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.messageId, { content: args.content })
	}
})

export const deleteMessage = mutation({
	args: {
		messageId: v.id('message')
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.messageId)
	}
})
