import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Employee from '@/models/Employee';

export async function GET() {
  try {
    await dbConnect();
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: employees }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await dbConnect();

    // Check if ID already exists
    const existingEmployer = await Employee.findOne({ employeeId: data.employeeId });
    if (existingEmployer) {
      return NextResponse.json({ success: false, error: "Employee ID already exists" }, { status: 400 });
    }

    const employee = new Employee(data);
    await employee.save();

    return NextResponse.json({ success: true, data: employee }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create employee" },
      { status: 500 }
    );
  }
}
