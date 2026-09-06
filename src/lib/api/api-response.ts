import { NextResponse } from "next/server";

export class ApiResponse {
  static success(
    data: unknown = null,
    message = "Success",
    status = 200
  ) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  static created(
    data: unknown = null,
    message = "Created successfully"
  ) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      {
        status: 201,
      }
    );
  }

  static noContent() {
    return new NextResponse(null, {
      status: 204,
    });
  }
}