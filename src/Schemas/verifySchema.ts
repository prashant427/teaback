import {z} from 'zod';

export const verifySchema = z.object({
    code: z.string().min(6, 'Verification code must be at least 6 characters long'),
});

export type VerifyInput = z.infer<typeof verifySchema>;