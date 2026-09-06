import {
    NextRequest,
    NextResponse,
} from "next/server";

const ACCESS_TOKEN_COOKIE =
    "adm_access_token";

export function proxy(
    request: NextRequest
) {
    const { pathname } =
        request.nextUrl;

    const isAdminRoute =
        pathname.startsWith(
            "/admin"
        );

    const isLoginRoute =
        pathname ===
        "/admin/login";

    if (!isAdminRoute) {
        return NextResponse.next();
    }

    const token =
        request.cookies.get(
            ACCESS_TOKEN_COOKIE
        )?.value;

    if (
        !token &&
        !isLoginRoute
    ) {
        return NextResponse.redirect(
            new URL(
                "/admin/login",
                request.url
            )
        );
    }

    if (
        token &&
        isLoginRoute
    ) {
        return NextResponse.redirect(
            new URL(
                "/admin/dashboard",
                request.url
            )
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
    ],
};