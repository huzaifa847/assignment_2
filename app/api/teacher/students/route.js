import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Get all students
export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    // Sort by name ascending
    const students = await User.find({ role: 'student' }).select('-password').sort({ name: 1 });
    
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Fetch Students Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Add a new student
export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    const { name, email, password, marks } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Please provide name, email, and password' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      marks: marks || 0,
    });

    return NextResponse.json(
      { _id: newStudent._id, name: newStudent.name, email: newStudent.email, role: newStudent.role, marks: newStudent.marks },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add Student Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
