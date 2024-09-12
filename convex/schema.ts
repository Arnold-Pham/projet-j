import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema(
	{
		message: defineTable({
			groupId: v.id('group'),
			userId: v.string(),
			user: v.string(),
			content: v.string()
		}),
		group: defineTable({
			userId: v.string(),
			user: v.string(),
			name: v.string()
		}),
		groupUsers: defineTable({
			groupId: v.string(),
			group: v.string(),
			userId: v.string(),
			user: v.string(),
			role: v.string()
		})
	},
	{ schemaValidation: true }
)
