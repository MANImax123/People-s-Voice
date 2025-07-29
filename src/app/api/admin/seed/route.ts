import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Admin } = await import('@/models/Admin');
    
    // Check if demo admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Demo admin already exists',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role
        }
      });
    }

    // Create demo admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const demoAdmin = new Admin({
      name: 'System Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: '+1234567890',
      role: 'admin',
      department: 'general',
      permissions: {
        assignIssues: true,
        manageTechs: true,
        viewReports: true,
        managePayments: true,
      },
      isActive: true,
    });

    await demoAdmin.save();

    return NextResponse.json({
      success: true,
      message: 'Demo admin created successfully',
      admin: {
        email: demoAdmin.email,
        name: demoAdmin.name,
        role: demoAdmin.role,
        department: demoAdmin.department
      }
    });

  } catch (error) {
    console.error('Error creating demo admin:', error);
    return NextResponse.json(
      { error: 'Failed to create demo admin' },
      { status: 500 }
    );
  }
}
