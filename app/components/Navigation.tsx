"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Card from "./ui/Card";
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur shadow-t py-2 px-2 flex justify-center">
      <Card color="white" rounded shadow className="flex justify-between w-full max-w-xl mx-auto px-4 py-2">
        {navItems.map((item) => (
          <Button key={item.href} color="neutral" size="sm" asChild className="flex flex-col items-center px-2 py-1">
            <Link href={item.href} className={`flex flex-col items-center ${pathname === item.href ? "text-blue-500" : "text-gray-500"}`}>
              <span className="mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          </Button>
        ))}
      </Card>
    </nav>
  );
}
