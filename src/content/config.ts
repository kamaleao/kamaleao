import { defineCollection, z } from 'astro:content';

// Usamos z.any() para que o Astro aceite QUALQUER formato de data/id 
// que estiver nos 5.000 arquivos sem travar o servidor.
const blogSchema = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    id: z.any().optional(),
    blog: z.string().optional(),
    thumb: z.string().optional(),
    // O segredo está aqui: z.any() aceita a data sem aspas
    date: z.any().optional(), 
  }),
});

export const collections = {
  'saoluis': blogSchema,
  'mascotes': blogSchema,
  'gospel': blogSchema,
};