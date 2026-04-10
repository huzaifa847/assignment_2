import Link from 'next/link';
import { School, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-32 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl glassmorphism rounded-3xl p-12 sm:p-16">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 shadow-inner">
              <School size={64} />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl mb-6">
            <span className="block">Student Hub</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Attendance & Marks
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            A seamless portal for teachers to manage students and for students to track their progress and attendance. Built for modern education.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_4px_14px_0_rgb(79,70,229,39%)] hover:shadow-[0_6px_20px_rgba(79,70,229,23%)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Portal Login <ArrowRight size={20} />
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 border-2 border-indigo-200 dark:border-indigo-800 text-lg font-medium rounded-xl text-indigo-700 dark:text-indigo-300 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all flex items-center justify-center"
            >
              Request Access
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
