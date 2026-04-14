"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Calculator,
  Settings,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Calendrier",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Simulateurs",
    href: "/simulators/urssaf",
    icon: Calculator,
  },
  {
    name: "Abonnement",
    href: "/settings",
    icon: CreditCard,
  },
  {
    name: "Parametres",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r bg-card lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          Copliance
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
