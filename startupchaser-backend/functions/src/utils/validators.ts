import { z } from 'zod';

export const ProfileTypeSchema = z.enum(['student', 'startup']);

export const SignUpSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.string().email().toLowerCase(),
	password: z.string().min(8).max(128),
	profile_type: ProfileTypeSchema,
	skills: z.array(z.string()).optional(),
	bio: z.string().max(1000).optional()
});

export const SignInSchema = z.object({
	idToken: z.string().min(10)
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;