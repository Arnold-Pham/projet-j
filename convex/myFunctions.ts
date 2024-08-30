import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const listMessage = query({
	args: {
		id: v.string()
	},
	handler: async (ctx, args) => {
		const messages = await ctx.db
			.query('message')
			.filter(q => q.eq(q.field('author'), args.id))
			.order('desc')
			.take(100)
		return messages.reverse()
	}
})

export const sendMessage = mutation({
	args: { author: v.string(), content: v.string() },
	handler: async (ctx, { author, content }) => {
		await ctx.db.insert('message', { author, content })
	}
})
