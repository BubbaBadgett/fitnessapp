"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: (active: boolean) => ReactNode;
};

function strokeIcon(path: string, active: boolean) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      style={active ? { filter: "drop-shadow(0 0 4px var(--accent-strong))" } : undefined}
    >
      <path
        d={path}
        stroke={active ? "var(--accent-strong)" : "var(--muted)"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const items: NavItem[] = [
  { href: "/", label: "Home", icon: (a) => strokeIcon("M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9", a) },
  { href: "/workout", label: "Workout", icon: (a) => strokeIcon("M6.5 8v8M17.5 8v8M2 10v4M22 10v4M6.5 12h11", a) },
  { href: "/weight", label: "Weight", icon: (a) => strokeIcon("M4 4h16v16H4zM8 4v3M16 4v3M9 13.5l2 2 4-4.5", a) },
  { href: "/progress", label: "Progress", icon: (a) => strokeIcon("M4 20V10M11 20V4M18 20v-7", a) },
  { href: "/settings", label: "Settings", icon: (a) => strokeIcon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-2-1.2L14 3h-4l-.5 2.6a7.4 7.4 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.4 7.4 0 0 0 2 1.2L10 21h4l.5-2.6a7.4 7.4 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.067-.395.1-.796.1-1.2Z", a) },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
              >
                {item.icon(active)}
                <span className={active ? "text-accent-strong" : "text-muted"}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
