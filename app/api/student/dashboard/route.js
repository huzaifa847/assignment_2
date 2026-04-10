import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// Get student dashboard data
export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'student') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    // Get user details (for marks)
    const student = await User.findById(decoded._id).select('-password');
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find({ student: decoded._id }).sort({ date: -1 });

    // Calculate stats
    const totalClasses = attendanceRecords.length;
    const presentClasses = attendanceRecords.filter(r => r.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    return NextResponse.json({
      student: {
        name: student.name,
        email: student.email,
        marks: student.marks || 0,
      },
      stats: {
        totalClasses,
        presentClasses,
        attendancePercentage,
      },
      history: attendanceRecords.map(r => ({
        id: r._id,
        date: r.date,
        status: r.status
      }))
    }, { status: 200 });
  } catch (error) {
    console.error('Fetch Student Dashboard Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
