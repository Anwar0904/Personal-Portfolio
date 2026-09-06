import { connectDB } from "@/lib/db";
import { seedRoles } from "@/lib/seed/roles.seed";
import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

export async function POST() {
    try {
        await connectDB();

        await seedRoles();

        return ApiResponse.success(
            null,
            "Roles seeded successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}