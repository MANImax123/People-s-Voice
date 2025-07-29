import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing full Issue model with refs and indexes...');
    await connectDB();
    console.log('Database connected');
    
    // Import full Issue model after database connection
    const { default: IssueFull } = await import('@/models/IssueFull');
    
    // Debug logging
    console.log('IssueFull model:', IssueFull);
    console.log('IssueFull.find type:', typeof IssueFull.find);
    
    // Test query
    const result = await IssueFull.find();
    console.log('Query result:', result);
    
    return NextResponse.json({ 
      success: true,
      model: IssueFull.toString(),
      findType: typeof IssueFull.find,
      queryResult: result
    });
  } catch (error) {
    console.error('Error in full issue test:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
