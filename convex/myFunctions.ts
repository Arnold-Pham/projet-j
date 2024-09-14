import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

/** ---------------- Group CRUD Operations ---------------- **/
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
			.query('members')
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
		await ctx.db.delete(args.groupId)
	}
})

/** ---------------- Members CRUD Operations ---------------- **/
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

export const removeMember = mutation({
	args: {
		memberId: v.id('members')
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.memberId)
	}
})

/** ---------------- Messages CRUD Operations ---------------- **/
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
		return await ctx.db
			.query('message')
			.filter(q => q.eq(q.field('groupId'), args.groupId))
			.order('desc')
			.take(100)
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

export const removeMessage = mutation({
	args: {
		messageId: v.id('message')
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.messageId)
	}
})
