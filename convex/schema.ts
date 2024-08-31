import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema(
	{
		message: defineTable({
			authorId: v.string(),
			author: v.string(),
			content: v.string()
		})
	},
	{ schemaValidation: true }
)
