import { Currency } from "@/enums";
import { z } from "zod";



export const BudgetSchema = z.object({
    amount: z.number(),
    currency: z.enum(Currency),
    type: z.enum(["fixed", "range"]),
});