import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const createGroup = mutation({
	args: {
		userId: v.string(),
		user: v.string(),
		name: v.string()
	},
	handler: async (ctx, args) => {
		const groupId = await ctx.db.insert('group', {
			userId: args.userId,
			user: args.user,
			name: args.name
		})
		return groupId
	}
})

export const listMyGroups = query({
	args: {
		userId: v.string()
	},
	handler: async (ctx, args) => {
		const myGroups = await ctx.db
			.query('member')
			.filter(q => q.eq(q.field('userId'), args.userId))
			.collect()

		const groupIds = myGroups.map(group => group.groupId)

		const groupsPromises = groupIds.map(groupId =>
			ctx.db
				.query('group')
				.filter(q => q.eq(q.field('_id'), groupId))
				.collect()
		)
		const groupsResults = await Promise.all(groupsPromises)
		const groups = groupsResults.flat()
		return groups
	}
})

export const listAllGroups = query({
	handler: async ctx => {
		return await ctx.db.query('group').collect()
	}
})

export const updateGroupName = mutation({
	args: {
		groupId: v.id('group'),
		name: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.groupId, { name: args.name })
	}
})

export const deleteGroup = mutation({
	args: {
		groupId: v.id('group')
	},
	handler: async (ctx, args) => {
		const { groupId } = args

		const messages = await ctx.db
			.query('message')
			.filter(q => q.eq(q.field('groupId'), groupId))
			.collect()

		const members = await ctx.db
			.query('member')
			.filter(q => q.eq(q.field('groupId'), groupId))
			.collect()

		for (const message of messages) {
			await ctx.db.delete(message._id)
		}

		for (const member of members) {
			await ctx.db.delete(member._id)
		}

		await ctx.db.delete(groupId)
	}
})
