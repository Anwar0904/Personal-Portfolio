import { z } from "zod";

export const ForgotPasswordSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email(),
  });

export type ForgotPasswordInput =
  z.infer<typeof ForgotPasswordSchema>;