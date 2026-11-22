import { v } from 'convex/values';
import { mutationGeneric as mutation, queryGeneric as query } from 'convex/server';

const category = v.union(
  v.literal('Food'),
  v.literal('Transport'),
  v.literal('Shopping'),
  v.literal('Bills'),
  v.literal('Health'),
  v.literal('Other'),
);

function checkDate(input: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) throw new Error('Invalid date');
  const [year = 0, month = 0, day = 0] = input.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  if (year < 1900 || d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    throw new Error('Invalid date');
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Sign in required to view expenses');
    return await ctx.db.query('expenses').filter(q => q.eq(q.field('userId'), identity.subject)).order('desc').take(50);
  },
});

export const add = mutation({
  args: { amountCents: v.number(), category, date: v.string(), note: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Sign in required to save expenses');
    if (!Number.isSafeInteger(args.amountCents) || args.amountCents <= 0 || args.amountCents > 1_000_000_000_00) {
      throw new Error('Invalid amount');
    }
    checkDate(args.date);
    if (args.note.length > 160) throw new Error('Note too long');
    return await ctx.db.insert('expenses', { ...args, userId: identity.subject });
  },
});
