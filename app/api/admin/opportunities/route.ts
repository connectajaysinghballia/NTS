import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Opportunity from '@/models/Opportunity';

export async function GET() {
  try {
    await dbConnect();
    const opportunities = await Opportunity.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: opportunities }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await dbConnect();

    const opportunity = new Opportunity(data);
    await opportunity.save();

    return NextResponse.json({ success: true, data: opportunity }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating opportunity:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create opportunity" },
      { status: 500 }
    );
  }
}
