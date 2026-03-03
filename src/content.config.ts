import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    id: z.number(),
    blog: z.string(),
    date: z.coerce.date(),
    thumb: z.string().optional(),
  }),
});

export const collections = { blog };