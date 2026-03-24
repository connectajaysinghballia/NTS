import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    
    // Connect to the database
    await dbConnect();

    // Check if the credentials match the initial admin setup
    // Initial Seed Check (for testing purposes, as requested by the user)
    if (username === 'nts' && password === 'nts555') {
        const existingAdmin = await Admin.findOne({ username: 'nts' });
        if (!existingAdmin) {
            await Admin.create({ username: 'nts', password: 'nts555' });
        }
        return NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 });
    }

    // Standard credential check in the database
    const admin = await Admin.findOne({ username, password });

    if (admin) {
      return NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid ID or Password' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Admin Auth Error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
