import { z } from "zod";

import {
    CreateTestimonialSchema,
    UpdateTestimonialSchema,
    TestimonialQuerySchema,
} from "@/validators/testimonial.validator";

export type CreateTestimonialInput =
    z.infer<typeof CreateTestimonialSchema>;

export type UpdateTestimonialInput =
    z.infer<typeof UpdateTestimonialSchema>;

export type TestimonialQuery =
    z.infer<typeof TestimonialQuerySchema>;