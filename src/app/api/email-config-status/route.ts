import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const configStatus = {
      emailUser: !!process.env.EMAIL_USER,
      emailPass: !!process.env.EMAIL_PASS,
      emailUserValue: process.env.EMAIL_USER || null
    };

    return NextResponse.json(configStatus);
  } catch (error) {
    return NextResponse.json({
      emailUser: false,
      emailPass: false,
      emailUserValue: null
    });
  }
}
