import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    token: z
      .string()
      .min(1, "Reset token is required."),

    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "One uppercase letter is required.")
      .regex(/[a-z]/, "One lowercase letter is required.")
      .regex(/[0-9]/, "One number is required.")
      .regex(
        /[^A-Za-z0-9]/,
        "One special character is required."
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

export type ResetPasswordInput =
  z.infer<typeof ResetPasswordSchema>;