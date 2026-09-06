import { NextResponse } from "next/server";

import { ZodError } from "zod";

import jwt from "jsonwebtoken";

export class ApiError extends Error {
  statusCode: number;

  errors?: unknown;

  constructor(
    statusCode: number,
    message: string,
    errors?: unknown
  ) {
    super(message);

    this.statusCode = statusCode;

    this.errors = errors;
  }
}

export class ApiErrorHandler {
  static handle(error: unknown) {
    console.error(error);

    // Custom Errors
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          errors: error.errors ?? null,
        },
        {
          status: error.statusCode,
        }
      );
    }

    // Zod Validation
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    // JWT
    if (
      error instanceof jwt.TokenExpiredError
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Token expired.",
        },
        {
          status: 401,
        }
      );
    }

    if (
      error instanceof jwt.JsonWebTokenError
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token.",
        },
        {
          status: 401,
        }
      );
    }

    // Unknown
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      {
        status: 500,
      }
    );
  }
}