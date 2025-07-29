import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // For now, logout is handled client-side by clearing localStorage
    // In a production app, you might want to invalidate JWT tokens here
    
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
