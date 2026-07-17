"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/collections", label: "Collections" },
  { href: "/explore", label: "Explore" },
  { href: "/learn", label: "Learn" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" }
];

export function SiteHeader() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <header className="site-header matched-site-header">
      <Link href="/" className="matched-brand" aria-label="Mahogany Archives home" onClick={closeMenu}>
        <Image
          className="matched-brand-logo"
          src="/images/mahogany-archives/mahogany-logo-enhanced.png"
          alt="Mahogany Archives"
          width={1160}
          height={356}
          priority
        />
      </Link>

      <button
        className="matched-menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        Menu
      </button>

      <nav
        id="main-navigation"
        className={`matched-main-nav${menuOpen ? " open" : ""}`}
        aria-label="Primary navigation"
      >
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} onClick={closeMenu}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="matched-header-actions">
        <Link href="/advanced-search" className="matched-icon-button" aria-label="Search">
          <span aria-hidden="true">⌕</span>
        </Link>
        {user ? (
          <>
            <Link
              href={user.role === "admin" ? "/admin" : "/dashboard"}
              className="matched-user-chip"
            >
              <ShieldCheck size={15} />
              {user.name}
            </Link>
            <button
              className="matched-icon-button"
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Log In</Link>
            <Link href="/login?mode=admin&next=/admin">Admin</Link>
            <Link className="matched-signup-button" href="/sign-up">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
