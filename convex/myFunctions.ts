import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const listMessage = query({
	args: {},
	handler: async ctx => {
		const messages = await ctx.db.query('message').order('desc').take(100)
		return messages.reverse()
	}
})

export const sendMessage = mutation({
	args: { author: v.string(), content: v.string() },
	handler: async (ctx, { author, content }) => {
		await ctx.db.insert('message', { author, content })
	}
})

export const getUsernames = query({
	args: {
		ids: v.array(v.string())
	},
	handler: async (ctx, args) => {}
})
