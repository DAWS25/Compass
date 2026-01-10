"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import styles from "./Navbar.module.css";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "HOME", href: "/", icon: "🏠" },
  { label: "CAPTURE", href: "/capture", icon: "📷" },
  { label: "CREATE EVENT", href: "/event/create", icon: "➕" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <ul className={styles.navList}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === "/place/1" && pathname?.startsWith("/place/"));
          
          return (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                className={classNames(styles.navLink, {
                  [styles.navLinkActive]: isActive,
                })}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

