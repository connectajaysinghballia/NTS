import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Inquiry from '@/models/Inquiry';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Connect to the database
    await dbConnect();

    // Create a new inquiry in the database
    const inquiry = await Inquiry.create(body);

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error: any) {
    console.error('--- MongoDB Connection Error ---');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('--------------------------------');
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed. Please ensure your credentials in .env.local are correct.',
      details: error.message 
    }, { status: 400 });
  }
}
