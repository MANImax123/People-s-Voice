import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing complex Issue model...');
    await connectDB();
    console.log('Database connected');
    
    // Import complex Issue model after database connection
    const { default: IssueComplex } = await import('@/models/IssueComplex');
    
    // Debug logging
    console.log('IssueComplex model:', IssueComplex);
    console.log('IssueComplex.find type:', typeof IssueComplex.find);
    
    // Test query
    const result = await IssueComplex.find();
    console.log('Query result:', result);
    
    return NextResponse.json({ 
      success: true,
      model: IssueComplex.toString(),
      findType: typeof IssueComplex.find,
      queryResult: result
    });
  } catch (error) {
    console.error('Error in complex issue test:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
