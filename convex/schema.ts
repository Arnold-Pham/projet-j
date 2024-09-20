import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema(
	{
		message: defineTable({
			groupId: v.id('group'),
			group: v.string(),
			userId: v.string(),
			user: v.string(),
			content: v.string()
		}),
		group: defineTable({
			userId: v.string(),
			user: v.string(),
			name: v.string()
		}),
		member: defineTable({
			groupId: v.id('group'),
			group: v.string(),
			userId: v.string(),
			user: v.string(),
			role: v.string()
		}),
		invitationCode: defineTable({
			groupId: v.id('group'),
			group: v.string(),
			creatorId: v.string(),
			code: v.string(),
			currentUses: v.number(),
			maxUses: v.optional(v.number()),
			expiresAt: v.optional(v.number())
		})
	},
	{ schemaValidation: true }
)
