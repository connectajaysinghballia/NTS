import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Opportunity from '@/models/Opportunity';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: opportunity }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch opportunity" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updateData = await req.json();
    await dbConnect();

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOpportunity) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedOpportunity }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating opportunity:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update opportunity" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();

    const deletedOpportunity = await Opportunity.findByIdAndDelete(id);

    if (!deletedOpportunity) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting opportunity:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete opportunity" },
      { status: 500 }
    );
  }
}
