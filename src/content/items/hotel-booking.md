---
title: 'Turn this into a hotel booking site'
summary: 'Swap the schema for nightly rate and occupancy fields, point the JSON-LD at LodgingBusiness, and add nanostores only once a booking flow needs cross-island state.'
publishDate: 2026-05-18
tags: ['booking', 'schema']
---

## What changes

Rename the collection from `items` to `rooms` in `src/content/config.ts`
and extend the schema:

```ts
schema: z.object({
  title: z.string(),
  nightlyRate: z.number(),
  maxOccupancy: z.number(),
  amenities: z.array(z.string()).default([]),
}),
```

A multi-step date-and-guests selection that a Svelte island needs to read
from elsewhere on the page is exactly the case CLAUDE.md's state-management
section describes — that's the point to add `nanostores`, not before.

## What stays the same

The listing and detail routes stay the same shape. Update the detail
route's JSON-LD `@type` from `CreativeWork` to `LodgingBusiness`, and the
listing page keeps working as your room directory with zero routing
changes.
