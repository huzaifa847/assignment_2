import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// Get attendance for a specific date
export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    
    if (!dateStr) {
      return NextResponse.json({ message: 'Date parameter is required' }, { status: 400 });
    }

    // Need to query exactly for the date given (ignoring time)
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    await connectToDatabase();
    
    // Get all students to ensure we have a record for everyone
    const students = await User.find({ role: 'student' }).select('_id name email').sort({ name: 1 });
    
    // Get attendance records for the date
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lt: endDate }
    });

    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      attendanceMap[record.student.toString()] = record.status;
    });

    // Map students with their attendance status
    const result = students.map(student => ({
      _id: student._id,
      name: student.name,
      email: student.email,
      status: attendanceMap[student._id.toString()] || null
    }));
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Fetch Attendance Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Mark or update attendance
// Request body should be { date: 'YYYY-MM-DD', attendance: [{ studentId: '...', status: 'present'|'absent' }, ...] }
export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    const { date, attendance } = await req.json();

    if (!date || !attendance || !Array.isArray(attendance)) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const targetDate = new Date(date);
    targetDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone shift dates

    // Use bulkWrite for efficient upserts
    const bulkOps = attendance.map(record => ({
      updateOne: {
        filter: { 
          student: record.studentId, 
          // Match by exactly day/month/year by checking bounds, but since we are doing upsert, 
          // we should be careful. We are using compound index {student, date} in Attendance schema 
          // to ensure unique per actual Date object, so we standardize the time part above.
          date: targetDate
        },
        update: { 
          $set: { 
            student: record.studentId, 
            date: targetDate, 
            status: record.status 
          } 
        },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await Attendance.bulkWrite(bulkOps);
    }

    return NextResponse.json({ message: 'Attendance updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Mark Attendance Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
