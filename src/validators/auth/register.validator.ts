import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address.")
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/, "One uppercase letter is required.")
    .regex(/[a-z]/, "One lowercase letter is required.")
    .regex(/[0-9]/, "One number is required.")
    .regex(
      /[^A-Za-z0-9]/,
      "One special character is required."
    ),
});

export type RegisterInput =
  z.infer<typeof RegisterSchema>;