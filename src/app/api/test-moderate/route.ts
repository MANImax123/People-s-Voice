import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing moderate complexity Issue model...');
    await connectDB();
    console.log('Database connected');
    
    // Import test Issue model after database connection
    const { default: IssueTest } = await import('@/models/IssueTest');
    
    // Debug logging
    console.log('IssueTest model:', IssueTest);
    console.log('IssueTest.find type:', typeof IssueTest.find);
    
    // Test query
    const result = await IssueTest.find();
    console.log('Query result:', result);
    
    return NextResponse.json({ 
      success: true,
      model: IssueTest.toString(),
      findType: typeof IssueTest.find,
      queryResult: result
    });
  } catch (error) {
    console.error('Error in moderate complexity issue test:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
