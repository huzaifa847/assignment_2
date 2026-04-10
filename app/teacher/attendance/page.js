'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Save, CheckCircle2, XCircle } from 'lucide-react';

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`/api/teacher/attendance?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      } else {
        setMessage({ text: 'Failed to fetch attendance', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setMessage({ text: 'Error fetching attendance', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setStudents(students.map(s => 
      s._id === studentId ? { ...s, status } : s
    ));
  };

  const markAll = (status) => {
    setStudents(students.map(s => ({ ...s, status })));
  };

  const saveAttendance = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });

    // Filter out students whose status hasn't been set
    const attendanceData = students
      .filter(s => s.status)
      .map(s => ({ studentId: s._id, status: s.status }));

    if (attendanceData.length === 0) {
      setMessage({ text: 'No attendance marked to save.', type: 'error' });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, attendance: attendanceData }),
      });

      if (res.ok) {
        setMessage({ text: 'Attendance saved successfully!', type: 'success' });
      } else {
        const data = await res.json();
        setMessage({ text: data.message || 'Failed to save attendance', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      setMessage({ text: 'Error saving attendance', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mark Attendance</h1>
            <p className="text-slate-500 mt-1">Record daily attendance for your students.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon size={18} className="text-slate-400" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' 
            : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="glassmorphism rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Student List</h2>
            <div className="space-x-3">
              <button
                onClick={() => markAll('present')}
                className="text-sm px-3 py-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60 transition-colors font-medium"
              >
                Mark All Present
              </button>
              <button
                onClick={() => markAll('absent')}
                className="text-sm px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 transition-colors font-medium"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading students...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm font-medium text-slate-500 uppercase tracking-wider">
                <div className="col-span-6 sm:col-span-4">Student Name</div>
                <div className="hidden sm:block sm:col-span-4">Email</div>
                <div className="col-span-6 sm:col-span-4 text-center">Status</div>
              </div>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((student) => (
                  <div key={student._id} className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors rounded-lg">
                    <div className="col-span-6 sm:col-span-4">
                      <p className="font-medium text-slate-900 dark:text-white">{student.name}</p>
                    </div>
                    <div className="hidden sm:flex sm:col-span-4 items-center text-sm text-slate-500 dark:text-slate-400">
                      {student.email}
                    </div>
                    <div className="col-span-6 sm:col-span-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(student._id, 'present')}
                        className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all border ${
                          student.status === 'present'
                            ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-500/20'
                            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(student._id, 'absent')}
                        className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all border ${
                          student.status === 'absent'
                            ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20'
                            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}

                {students.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    No students found. Add students from the dashboard first.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
              onClick={saveAttendance}
              disabled={saving || students.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/30"
            >
              {saving ? 'Saving...' : (
                <>
                  <Save size={20} />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
