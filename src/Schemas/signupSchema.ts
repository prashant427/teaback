import { z } from 'zod';

export const usernameSchema = z.object({
    username: z.string()
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name must be at most 100 characters long')
        .regex(/^[A-Za-z0-9@_,\s]+$/, 'Name can only contain letters, numbers, @, _ and spaces')
});

export const signupSchema = z
    .object({
        username:  z.string()
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name must be at most 100 characters long')
        .regex(/^[A-Za-z0-9@_,\s]+$/, 'Name can only contain letters, numbers, @, _ and spaces'),
        email: z
            .string()
            .email('Invalid email address')
            .trim()
            .toLowerCase()
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
        password: z
            .string()
            .min(4, {message: 'Password must be at least 4 characters long'})
            .regex(
                /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/,
                'Password must include uppercase, lowercase, number and special character'
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

export type SignupInput = z.infer<typeof signupSchema>;