import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Create
export const sendMessage = mutation({
	args: {
		authorId: v.string(),
		author: v.string(),
		content: v.string()
	},
	handler: async (ctx, { authorId, author, content }) => {
		await ctx.db.insert('message', { authorId, author, content })
	}
})

// Read
export const listMessages = query({
	args: {
		id: v.string()
	},
	handler: async (ctx, args) => {
		const messages = await ctx.db
			.query('message')
			.filter(q => q.eq(q.field('authorId'), args.id))
			.order('desc')
			.take(100)
		return messages.reverse()
	}
})

// Update

// Delete

export const listAllMessage = query({
	args: {},
	handler: async ctx => {
		const allMessages = await ctx.db.query('message').order('desc').take(100)
		return allMessages.reverse()
	}
})
