import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// Admin authorization code for security
const ADMIN_AUTH_CODE = 'CIVIC_ADMIN_2025';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Admin } = await import('@/models/Admin');
    
    const body = await request.json();
    const { name, email, password, phone, department, adminCode } = body;

    // Validation
    if (!name || !email || !password || !adminCode) {
      return NextResponse.json(
        { error: 'Name, email, password, and admin code are required' },
        { status: 400 }
      );
    }

    // Verify admin authorization code
    if (adminCode !== ADMIN_AUTH_CODE) {
      return NextResponse.json(
        { error: 'Invalid admin authorization code' },
        { status: 403 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'An admin account with this email already exists' },
        { status: 409 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin
    const newAdmin = new Admin({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim() || '',
      role: 'admin',
      department: department || 'general',
      permissions: {
        assignIssues: true,
        manageTechs: true,
        viewReports: true,
        managePayments: true,
      },
      isActive: true,
    });

    await newAdmin.save();

    // Return success (excluding password)
    const adminData = {
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      department: newAdmin.department,
      permissions: newAdmin.permissions,
      createdAt: newAdmin.createdAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      admin: adminData,
    });

  } catch (error) {
    console.error('Admin signup error:', error);
    
    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'An admin account with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    );
  }
}
