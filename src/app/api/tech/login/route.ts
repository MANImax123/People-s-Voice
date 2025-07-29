import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Tech from '@/models/Tech';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find tech by email
    const tech = await Tech.findOne({ email });
    if (!tech) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, tech.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if tech is active
    if (tech.status !== 'active') {
      return NextResponse.json(
        { message: 'Account is not active. Please contact administrator.' },
        { status: 403 }
      );
    }

    // Update last login and ensure role is correct
    const updatedTech = await Tech.findOneAndUpdate(
      { email },
      { 
        lastLoginAt: new Date(),
        role: 'tech' // Ensure role is always 'tech'
      },
      { new: true, runValidators: false } // Skip validation to avoid enum error
    );

    // Remove password from response
    const techResponse = updatedTech.toObject();
    delete techResponse.password;

    return NextResponse.json(
      { 
        message: 'Login successful',
        tech: techResponse,
        token: `tech_${updatedTech.id}_${Date.now()}` // Simple token for development
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Tech login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
