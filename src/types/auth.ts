import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type SignUpForm = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type SignInForm = z.infer<typeof SignInSchema>;
