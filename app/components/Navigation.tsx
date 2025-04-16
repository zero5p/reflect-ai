'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, BookText, Home, LineChart } from 'lucide-react';

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

export default function Navigation() {
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    { name: '홈', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: '캘린더', path: '/calendar', icon: <Calendar className="h-5 w-5" /> },
    { name: '성찰', path: '/reflection', icon: <BookText className="h-5 w-5" /> },
    { name: '추천', path: '/schedule', icon: <LineChart className="h-5 w-5" /> },
  ];
  
  return (
    <nav className="bg-white border-t fixed bottom-0 left-0 right-0 z-10">
      <div className="max-w-screen-md mx-auto">
        <ul className="flex">
          {navItems.map((item) => (
            <li key={item.path} className="flex-1">
              <Link 
                href={item.path}
                className={`flex flex-col items-center py-2 ${
                  pathname === item.path ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}