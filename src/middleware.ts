import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server'; // 👈 Add this

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/unauthorized(.*)',
  '/api/webhook/clerk'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const unauthorizeUrl = new URL('/unauthorized', req.url); // 👈 Build full URL
      return NextResponse.redirect(unauthorizeUrl); // 👈 Correct redirect
    }
  }

  return NextResponse.next(); // 👈 Make sure to return this
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/api/webhook/clerk'
  ]
};
