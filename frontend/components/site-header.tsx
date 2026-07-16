"use client";

import Link from "next/link";
import { LogOut, Menu, Search, ShieldCheck, X } from "lucide-react";
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
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="Mahogany Archives home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span className="brand-copy" aria-hidden="true">
            <strong>Mahogany</strong>
            <small>Archives</small>
          </span>
        </Link>

        <nav
          id="primary-navigation"
          className={`primary-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <Link href={item.href} key={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={`header-actions${menuOpen ? " is-open" : ""}`}>
          <Link href="/advanced-search" className="icon-button" aria-label="Search" onClick={closeMenu}>
            <Search size={17} />
          </Link>
          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="user-chip"
                onClick={closeMenu}
              >
                <ShieldCheck size={16} />
                {user.name}
              </Link>
              <button className="icon-button" type="button" onClick={handleLogout} aria-label="Log out">
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="header-login" onClick={closeMenu}>
                Log In
              </Link>
              <Link href="/sign-up" className="header-signup" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="site-menu-button icon-button"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
