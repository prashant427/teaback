import {z} from 'zod';

export const acceptMsgSchema = z.object({
    msgAccepted: z.boolean(),
});

export type acceptMsgInput = z.infer<typeof acceptMsgSchema>;  