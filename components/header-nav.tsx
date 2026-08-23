"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {headerNavigation} from "@/resources/resources";

export function HeaderNav() {
  const pathname = usePathname();
  
  return (
    <nav className="flex justify-center space-x-8 py-4 border-t border-gray-50 line-clamp-1">
      {headerNavigation.map(([label, href], i, self) => {
        const isActive = pathname === href;
        return (
          <Link
            key={i}
            href={href as string}
            className={`text-xs font-semibold uppercase tracking-wide transition-colors ${isActive ? "text-blue-600" : "text-gray-900 hover:text-blue-600"
            } ${i === self.length - 1 ? "hidden md:inline-block" : ""}`}
          >
            {label as string}
          </Link>
        );
      })}
    </nav>
  );
}
