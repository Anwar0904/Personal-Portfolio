import { ZodError } from "zod";
import { Error as MongooseError } from "mongoose";

import { ApiError } from "./api-error";
import { ApiResponse } from "./api-response";

export function handleApiError(error: unknown) {
    console.error(error);

    if (error instanceof ApiError) {
        return ApiResponse.success(
            null,
            error.message,
            error.statusCode
        );
    }

    if (error instanceof ZodError) {
        return ApiResponse.success(
            error.flatten(),
            "Validation failed.",
            400
        );
    }

    if (
        error instanceof
        MongooseError.ValidationError
    ) {
        return ApiResponse.success(
            error.errors,
            "Validation failed.",
            400
        );
    }

    if (
        error instanceof
        MongooseError.CastError
    ) {
        return ApiResponse.success(
            null,
            "Invalid ID.",
            400
        );
    }

    if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 11000
    ) {
        const duplicate =
            error as {
                keyValue?: Record<
                    string,
                    unknown
                >;
            };

        return ApiResponse.success(
            duplicate.keyValue,
            "Duplicate value.",
            409
        );
    }

    return ApiResponse.success(
        null,
        "Internal server error.",
        500
    );
}