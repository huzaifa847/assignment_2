import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Update a student
export async function PUT(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    const { id } = await params;
    
    if (!decoded || decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    const { name, email, marks, password } = await req.json();
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (marks !== undefined) updateData.marks = marks;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedStudent = await User.findOneAndUpdate(
      { _id: id, role: 'student' },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedStudent) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    console.error('Update Student Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete a student
export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    const { id } = await params;
    
    if (!decoded || decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    const deletedStudent = await User.findOneAndDelete({ _id: id, role: 'student' });
    
    if (!deletedStudent) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete Student Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
