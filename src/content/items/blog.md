---
title: 'Turn this into a blog'
summary: 'This is the smallest jump of the three: keep most of the schema, swap the JSON-LD type to Article, and rename the folder.'
publishDate: 2026-06-02
tags: ['blog', 'schema']
---

## What changes

Barely anything. The `items` schema already has a title, a summary, a
publish date, and tags — that's most of a blog post's frontmatter already.
Add an `author` field if you need a byline:

```ts
schema: z.object({
  title: z.string(),
  summary: z.string(),
  publishDate: z.coerce.date(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
}),
```

## What stays the same

Everything else. Rename `src/content/items/` to `src/content/posts/` (and
the matching `src/pages/items/` folder to `src/pages/posts/`), swap the
detail route's JSON-LD `@type` from `CreativeWork` to `Article`, and this
example is a working blog.
