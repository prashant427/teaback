import {z} from 'zod';

export const messageSchema = z.object({
    content: z
    .string()
    .min(1, 'Message content is required : bhi kuch to bol')
    .max(500, 'Message content must be at most 500 characters long: pram patr ki bhi jaruat nahi thi'),
});

export type MessageInput = z.infer<typeof messageSchema>;