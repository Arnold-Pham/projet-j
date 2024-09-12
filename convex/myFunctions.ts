import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

//	GROUPS
export const createGroup = mutation({
	args: {
		userId: v.string(),
		user: v.string(),
		name: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('group', {
			userId: args.userId,
			user: args.user,
			name: args.name
		})
	}
})

export const deleteGroup = mutation({
	args: {
		id: v.id('group')
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id)
	}
})

export const getGroupId = query({
	args: {
		userId: v.string(),
		name: v.string()
	},
	handler: async (ctx, args) => {
		const group = await ctx.db
			.query('group')
			.filter(q => q.and(q.eq(q.field('userId'), args.userId), q.eq(q.field('name'), args.name)))
			.take(1)
		return group.length > 0 ? group[0]._id : null
	}
})

//	JOINTURE GROUPS-USERS
export const joinGroup = mutation({
	args: {
		groupId: v.string(),
		group: v.string(),
		userId: v.string(),
		user: v.string(),
		role: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('groupUsers', {
			groupId: args.groupId,
			group: args.group,
			userId: args.userId,
			user: args.user,
			role: args.role
		})
	}
})

export const joinSearch = query({
	args: {
		groupId: v.id('group'),
		userId: v.string()
	},
	handler: async (ctx, args) => {
		const searchGroupId = await ctx.db
			.query('groupUsers')
			.filter(q => q.and(q.eq(q.field('groupId'), args.groupId), q.eq(q.field('userId'), args.userId)))
			.take(1)
		return searchGroupId.length > 0 ? searchGroupId[0]._id : null
	}
})

export const leaveGroup = mutation({
	args: {
		groupUsersId: v.id('groupUsers')
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.groupUsersId)
	}
})

export const getUsersGroups = query({
	args: {
		userId: v.string()
	},
	handler: async (ctx, args) => {
		const usersGroup = await ctx.db
			.query('groupUsers')
			.filter(q => q.eq(q.field('userId'), args.userId))
			.order('desc')
			.take(100)
		return usersGroup.reverse()
	}
})

//	MESSAGES
export const sendMessage = mutation({
	args: {
		groupId: v.id('group'),
		userId: v.string(),
		user: v.string(),
		content: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('message', {
			groupId: args.groupId,
			userId: args.userId,
			user: args.user,
			content: args.content
		})
	}
})

export const updateMessage = mutation({
	args: {
		id: v.id('message'),
		content: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, {
			content: args.content
		})
	}
})

export const deleteMessage = mutation({
	args: {
		id: v.id('message')
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id)
	}
})

export const listAllMessages = query({
	args: {},
	handler: async ctx => {
		const allMessages = await ctx.db.query('message').order('desc').take(100)
		return allMessages.reverse()
	}
})
