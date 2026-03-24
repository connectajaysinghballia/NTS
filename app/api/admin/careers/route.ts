import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Career from '@/models/Career';

export async function GET() {
  try {
    await dbConnect();
    const careers = await Career.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: careers }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching careers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch career applications" },
      { status: 500 }
    );
  }
}
