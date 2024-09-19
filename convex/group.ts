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

		await ctx.db.insert('member', {
			groupId: groupId,
			group: args.name,
			userId: args.userId,
			user: args.user,
			role: 'admin'
		})

		return { success: 1, message: 'Groupe créé' }
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

		const groupData = myGroups.map(member => ({
			groupId: member.groupId,
			role: member.role
		}))

		const groupIds = Array.from(new Set(groupData.map(data => data.groupId)))

		const groupsPromises = groupIds.map(groupId =>
			ctx.db
				.query('group')
				.filter(q => q.eq(q.field('_id'), groupId))
				.collect()
		)

		const groupsResults = await Promise.all(groupsPromises)
		const groups = groupsResults.flat()

		const groupsWithRoles = groups.map(group => {
			const memberData = groupData.find(data => data.groupId === group._id)
			return { ...group, role: memberData?.role || 'member' }
		})

		return groupsWithRoles
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

		const codes = await ctx.db
			.query('invitationCode')
			.filter(q => q.eq(q.field('groupId'), groupId))
			.collect()

		for (const message of messages) await ctx.db.delete(message._id)
		for (const member of members) await ctx.db.delete(member._id)
		for (const code of codes) await ctx.db.delete(code._id)

		await ctx.db.delete(groupId)
		return { success: 1, message: 'Groupe effacé' }
	}
})
