---
title: 'Turn this into a product catalog'
summary: 'Swap the schema for price and stock fields, point the JSON-LD at Product, and the routing underneath stays the same.'
publishDate: 2026-05-04
tags: ['e-commerce', 'schema']
---

## What changes

Rename the collection from `items` to `products` in `src/content/config.ts`
and extend the schema:

```ts
schema: z.object({
  title: z.string(),
  price: z.number(),
  currency: z.string().default('USD'),
  inStock: z.boolean().default(true),
}),
```

Add one Markdown file per product under `src/content/products/`, same as
the example entries here.

## What stays the same

`src/pages/items/index.astro` and `src/pages/items/[slug].astro` don't
change in shape — `getCollection()` and `getStaticPaths()` don't know or
care what a "product" is, they just fetch entries and generate one static
page per entry. Rename the folder to `products/` for clarity, then update
the detail route's JSON-LD `@type` from `CreativeWork` to `Product` and add
an `offers` block with the price.
