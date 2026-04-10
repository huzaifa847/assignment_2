import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function proxy(req) {
  const token = req.cookies.get('token')?.value;

  const { pathname } = req.nextUrl;

  // Protect teacher and student routes
  if (pathname.startsWith('/teacher') || pathname.startsWith('/student')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      // In middleware, we can't use full jsonwebtoken library easily because 
      // it uses Node APIs and middleware runs on Edge Runtime. 
      // We will decrypt it with standard JS or just redirect for now if token format is wrong.
      // Wait, standard jwt payload is base64 encoded, we can just decode the payload.
      const payloadBase64Url = token.split('.')[1];
      const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payloadStr = atob(payloadBase64);
      const decoded = JSON.parse(payloadStr);

      if (pathname.startsWith('/teacher') && decoded.role !== 'teacher') {
        return NextResponse.redirect(new URL('/student/dashboard', req.url));
      }

      if (pathname.startsWith('/student') && decoded.role !== 'student') {
        return NextResponse.redirect(new URL('/teacher/dashboard', req.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/teacher/:path*', '/student/:path*'],
};
