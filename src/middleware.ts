import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || 'default_secret_key_change_me';
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;

    // Public paths
    if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/api/init-db')) {
        return NextResponse.next();
    }

    if (!session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });

        const userRole = payload.role as string;
        const rolePath = `/${userRole.toLowerCase()}`;

        // If trying to access a different role's dashboard
        if (pathname.startsWith('/admin') && userRole !== 'Admin') {
            return NextResponse.redirect(new URL(rolePath, request.url));
        }
        if (pathname.startsWith('/department') && userRole !== 'Department') {
            return NextResponse.redirect(new URL(rolePath, request.url));
        }
        if (pathname.startsWith('/school') && userRole !== 'School') {
            return NextResponse.redirect(new URL(rolePath, request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.log('Middleware session verification failed', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
