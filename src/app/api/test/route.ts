import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Database connected');
    
    // Import test model after connection
    const { default: TestModel } = await import('@/models/Test');
    console.log('TestModel:', TestModel);
    console.log('TestModel.find type:', typeof TestModel.find);
    
    // Try to run a simple query
    const result = await TestModel.find().limit(1);
    console.log('Query result:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Mongoose model works!',
      resultCount: result.length
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
