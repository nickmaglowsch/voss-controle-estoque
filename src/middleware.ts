import { createMiddlewareClient } from '@/utils/supabase'
import { NextResponse, type NextRequest } from 'next/server'

function createLoginRedirect(req: NextRequest, reason: string): NextResponse {
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('redirected', 'true')
  loginUrl.searchParams.set('reason', reason)
  const loginResponse = NextResponse.redirect(loginUrl)
  loginResponse.headers.set('x-login', 'true')
  return loginResponse
}

export async function middleware(req: NextRequest) {
  const { supabase, response } = createMiddlewareClient(req)

  const { pathname } = req.nextUrl

  // Handle logout
  if (pathname === '/logout') {
    await supabase.auth.signOut()
    return createLoginRedirect(req, 'logout')
  }

  // Get the user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to login if there is no session and the user is trying to access any route except /login
  if (!session && pathname !== '/login') {
    return createLoginRedirect(req, 'no_session')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login).*)'],
}
