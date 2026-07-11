import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Generic "typed collection + detail page per entry" extension point. It
// ships as "items" on purpose — not "products" or "rooms" — so it doesn't
// presuppose which vertical this starter grows into. See src/pages/items/
// for the listing + detail routes, and CLAUDE.md for how to add a new
// collection of your own.
const items = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/items' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { items };
