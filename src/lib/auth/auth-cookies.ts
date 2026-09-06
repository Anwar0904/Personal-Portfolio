import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE =
    "adm_access_token";

const REFRESH_TOKEN_COOKIE =
    "adm_refresh_token";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export async function setAuthCookies(
    accessToken: string,
    refreshToken: string
) {
    const cookieStore = await cookies();

    cookieStore.set(
        ACCESS_TOKEN_COOKIE,
        accessToken,
        {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 15,
        }
    );

    cookieStore.set(
        REFRESH_TOKEN_COOKIE,
        refreshToken,
        {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 30,
        }
    );
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();

    cookieStore.delete(
        ACCESS_TOKEN_COOKIE
    );

    cookieStore.delete(
        REFRESH_TOKEN_COOKIE
    );
}

export async function getAccessToken() {
    const cookieStore = await cookies();

    return cookieStore.get(
        ACCESS_TOKEN_COOKIE
    )?.value;
}

export async function getRefreshToken() {
    const cookieStore = await cookies();

    return cookieStore.get(
        REFRESH_TOKEN_COOKIE
    )?.value;
}