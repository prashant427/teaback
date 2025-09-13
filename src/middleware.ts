import { NextResponse, NextRequest } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  
  if ((
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup') ||
      request.nextUrl.pathname.startsWith('/verify')) 
    && token?.isVerified) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } 
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token?.isVerified) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  

  return NextResponse.next()
}
 
export const config = {
  matcher: [
    "/",
    '/login',
    '/signup',
    "/dashboard/:path*",
    "/verify/:path*"
  ],
}