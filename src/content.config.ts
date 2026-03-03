import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    id: z.number().optional(), // Mudei para opcional caso algum post não tenha ID
    blog: z.string().optional(),
    date: z.any(), // "any" aceita qualquer formato de data sem dar erro
    thumb: z.string().optional(),
  }),
});

export const collections = { blog };