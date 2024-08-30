// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema(
	{
		message: defineTable({
			author: v.string(),
			content: v.string()
		})
	},
	{ schemaValidation: true }
)
