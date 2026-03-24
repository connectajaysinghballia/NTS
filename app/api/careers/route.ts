import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Career from "@/models/Career";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    
    // Extract base fields
    const jobTitle = formData.get("jobTitle") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const experience = formData.get("experience") as string;
    const linkedin = formData.get("linkedin") as string;
    const coverLetter = formData.get("coverLetter") as string;
    
    // Extract file
    const resumeFile = formData.get("resume") as File;

    if (!resumeFile) {
      return NextResponse.json({ success: false, error: "Resume file is required." }, { status: 400 });
    }

    // Prepare upload directory
    const uploadDir = join(process.cwd(), "public/uploads/resumes");
    
    // Check if directory exists, if not create it
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Read and save file
    const bytes = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename to prevent overwriting
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalExt = resumeFile.name.split('.').pop();
    const fileName = `${fullName.replace(/\s+/g, '-').toLowerCase()}-${uniqueSuffix}.${originalExt}`;
    const filePath = join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);

    // Save public path reference
    const resumePath = `/uploads/resumes/${fileName}`;

    // Create database entry
    const application = await Career.create({
      jobTitle,
      fullName,
      email,
      phone,
      location,
      experience,
      linkedin,
      resumePath,
      coverLetter,
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });

  } catch (error: any) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit application." },
      { status: 500 }
    );
  }
}
