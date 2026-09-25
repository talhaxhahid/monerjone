import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'monerjone_token';

// If a logged-in user hits the bare root domain (the public splash/landing
// page), send them straight to their dashboard instead — the same way
// Facebook/Instagram skip the marketing page for signed-in visitors.
// This is a lightweight presence check on the auth cookie (not a full JWT
// verification) purely for the redirect decision; every route/API still
// independently verifies the token server-side via getCurrentUser().
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
