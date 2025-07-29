import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing simplified Issue model...');
    await connectDB();
    console.log('Database connected');
    
    // Import simplified Issue model after database connection
    const { default: IssueSimple } = await import('@/models/IssueSimple');
    
    // Debug logging
    console.log('IssueSimple model:', IssueSimple);
    console.log('IssueSimple.find type:', typeof IssueSimple.find);
    
    // Test query
    const result = await IssueSimple.find();
    console.log('Query result:', result);
    
    return NextResponse.json({ 
      success: true,
      model: IssueSimple.toString(),
      findType: typeof IssueSimple.find,
      queryResult: result
    });
  } catch (error) {
    console.error('Error in simplified issue test:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
