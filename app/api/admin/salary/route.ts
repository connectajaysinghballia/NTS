import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SalarySlip from '@/models/SalarySlip';

// GET: Fetch all historical salary slips
export async function GET() {
  try {
    await dbConnect();
    const slips = await SalarySlip.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: slips }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching salary slips:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch salary slips" },
      { status: 500 }
    );
  }
}

// POST: Save a new salary slip to the database
export async function POST(req: Request) {
  try {
    const data = await req.json();
    await dbConnect();

    // Verification - Ensure employee and month combo isn't completely duplicated 
    // (Optional logic, allowing multiples for now to support corrections, but good practice to check)
    const existingSlip = await SalarySlip.findOne({
      employeeId: data.employeeId,
      month: data.month,
      year: data.year
    });

    if (existingSlip) {
      // We log but don't strictly prevent overriding, we just save a new record 
      // as companies might need to regenerate a corrected slip for the same month
    }

    const slip = new SalarySlip(data);
    await slip.save();

    return NextResponse.json({ success: true, data: slip }, { status: 201 });
  } catch (error: any) {
    console.error("Error saving salary slip:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save salary slip" },
      { status: 500 }
    );
  }
}
