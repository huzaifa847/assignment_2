import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify the student'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify the attendance date'],
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: [true, 'Please specify the attendance status'],
    },
  },
  { timestamps: true }
);

// Compound index to ensure a student only has one attendance record per day
AttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
