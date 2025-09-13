import { z } from 'zod';

export const loginSchema = z
    .object({

        

        email: z
            .string()
            .email('Invalid email address')
            .trim()
            .toLowerCase(),

        password: z
            .string()
            .min(4, {message: 'Password must be at least 4 characters long'})
            .regex(
                /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/,
                'Password must include uppercase, lowercase, number and special character'
            ),
        
    })
    .required();

export type LoginInput = z.infer<typeof loginSchema>;