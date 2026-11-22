import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  expenses: defineTable({
    userId: v.string(),
    amountCents: v.number(),
    category: v.union(
      v.literal('Food'),
      v.literal('Transport'),
      v.literal('Shopping'),
      v.literal('Bills'),
      v.literal('Health'),
      v.literal('Other'),
    ),
    date: v.string(),
    note: v.string(),
  }).index('by_user', ['userId']),
});
