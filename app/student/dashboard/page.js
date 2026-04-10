'use client';

import { useState, useEffect } from 'react';
import { Award, Calendar, BookOpen, Percent, CheckCircle2, XCircle } from 'lucide-react';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/student/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="animate-pulse text-indigo-600 dark:text-indigo-400 text-xl font-medium">Loading your portal...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen pt-24 px-4 text-center text-red-600 bg-slate-50 dark:bg-slate-900">{error}</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {data?.student.name}!</h1>
          <p className="text-slate-500 mt-1">Here's your academic progress overview.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glassmorphism rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
              <Award size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Marks</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{data?.student.marks}</p>
            </div>
          </div>

          <div className="glassmorphism rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
              <Percent size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Attendance</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{data?.stats.attendancePercentage}%</p>
            </div>
          </div>

          <div className="glassmorphism rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Classes Attended</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{data?.stats.presentClasses} <span className="text-lg text-slate-400">/ {data?.stats.totalClasses}</span></p>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="glassmorphism rounded-2xl p-6 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Attendance History</h2>
          </div>

          {data?.history && data.history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-slate-200 dark:divide-slate-700/50">
                  {data.history.map((record) => {
                    const dateObj = new Date(record.date);
                    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                    
                    return (
                      <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.status === 'present' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 shadow-sm">
                              <CheckCircle2 size={14} /> Present
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 shadow-sm">
                              <XCircle size={14} /> Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No attendance records found yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
