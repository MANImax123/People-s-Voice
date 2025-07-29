import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tech from '@/models/Tech';

export async function GET() {
  try {
    await dbConnect();
    
    const count = await Tech.countDocuments();
    
    return NextResponse.json({
      message: 'Database connection successful',
      techCount: count,
      status: 'connected'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    }, { status: 500 });
  }
}
