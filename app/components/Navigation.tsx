"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";
import { Home, CalendarDays, BookText, BarChart2 } from "lucide-react";

type NavItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", icon: <Home />, label: "홈" },
  { href: "/calendar", icon: <CalendarDays />, label: "캘린더" },
  { href: "/reflection", icon: <BookText />, label: "성찰" },
  { href: "/schedule", icon: <BarChart2 />, label: "일정" },
];

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-white/90 border-t border-gray-100 backdrop-blur-md shadow-lg">
      <div className="max-w-xl mx-auto flex flex-row justify-between items-center px-2 py-2 md:px-6 md:py-3">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            color={pathname === item.href ? "mint" : "gray"}
            size="sm"
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all ${pathname === item.href ? 'shadow-md scale-110' : ''}`}
            aria-label={item.label}
          >
            <Link href={item.href} className="flex flex-col items-center">
              <span className={`text-lg md:text-xl ${pathname === item.href ? 'text-mint-600' : 'text-gray-400'}`}>{item.icon}</span>
              <span className={`text-xs font-medium ${pathname === item.href ? 'text-mint-700' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
