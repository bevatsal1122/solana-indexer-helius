"use client";

import Cookies from "js-cookie";

// Cookie names
export const AUTH_TOKEN_COOKIE = "supabase_auth_token";

// Cookie expiry in days (30 days = 1 month)
const COOKIE_EXPIRY = 1;

export const setAuthCookie = (token: string) => {
  Cookies.set(AUTH_TOKEN_COOKIE, token, {
    expires: COOKIE_EXPIRY,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export const getAuthCookie = (): string | undefined => {
  return Cookies.get(AUTH_TOKEN_COOKIE);
};

export const removeAuthCookie = () => {
  Cookies.remove(AUTH_TOKEN_COOKIE, { path: "/" });
}; 