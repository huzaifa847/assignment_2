'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOut, User as UserIcon, Settings, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only fetch user on dashboard routes
    if (pathname.startsWith('/teacher') || pathname.startsWith('/student')) {
      fetch('/api/auth/me')
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Not logged in');
        })
        .then((data) => setUser(data.user))
        .catch(() => {
          router.push('/login');
        });
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  // Don't show navbar on auth routes or home
  if (['/login', '/register', '/'].includes(pathname)) return null;

  return (
    <nav className="fixed top-0 w-full z-50 glassmorphism border-b-0 border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                StudentHub
              </span>
            </Link>
            
            <div className="ml-10 flex items-baseline space-x-4">
              {user?.role === 'teacher' && (
                <>
                  <Link
                    href="/teacher/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/teacher/dashboard'
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/teacher/attendance"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/teacher/attendance'
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    Attendance
                  </Link>
                </>
              )}
              {user?.role === 'student' && (
                <Link
                  href="/student/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/student/dashboard'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  My Portal
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <UserIcon size={16} />
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-medium text-slate-900 dark:text-white leading-none">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
