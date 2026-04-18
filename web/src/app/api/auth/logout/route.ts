import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // De-authenticate by stripping the JWT cookie explicitly
    cookieStore.set({
      name: 'admin_session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, 
    });

    return NextResponse.json({ success: true, message: 'Session destroyed. Disconnected.' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to destroy session.' }, { status: 500 });
  }
}
