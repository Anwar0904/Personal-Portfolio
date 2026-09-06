import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
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
      data.newPassword ===
      data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

export type ChangePasswordInput =
  z.infer<typeof ChangePasswordSchema>;