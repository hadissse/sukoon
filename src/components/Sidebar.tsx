"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav>
      <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
        Home
      </Link>
      <Link
        href="/about"
        aria-current={pathname === "/about" ? "page" : undefined}
      >
        About
      </Link>
    </nav>
  );
}
