import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Technician from '@/models/Technician';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, password, phone, specialization, experience } = body;

    // Validation
    if (!name || !email || !password || !phone || !specialization || !experience) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if tech already exists
    const existingTech = await Technician.findOne({ email });
    if (existingTech) {
      return NextResponse.json(
        { message: 'Tech with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new tech
    const newTech = new Technician({
      name,
      email,
      password: hashedPassword,
      phone,
      specialization,
      experience,
      role: 'tech',
      status: 'active',
      completedTasks: 0,
      rating: 0
    });

    // Save to MongoDB
    await newTech.save();

    // Remove password from response
    const techResponse = newTech.toObject();
    delete techResponse.password;

    return NextResponse.json(
      { 
        message: 'Tech account created successfully',
        tech: techResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Tech signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all techs
export async function GET() {
  try {
    await dbConnect();
    
    const techs = await Technician.find({}, '-password'); // Exclude password field
    
    return NextResponse.json(
      { 
        techs,
        count: techs.length 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching techs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
