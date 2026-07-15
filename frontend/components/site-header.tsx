"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Search, ShieldCheck } from "lucide-react";
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

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Mahogany Archives home">
        <span className="brand-logo-mark-frame" aria-hidden="true">
          <Image
            src="/images/mahogany-logo.jpeg"
            alt=""
            width={96}
            height={96}
            priority
            className="brand-logo-mark-image"
          />
        </span>
        <span className="brand-wordmark" aria-hidden="true">
          <strong>Mahogany</strong>
          <small>Archives</small>
        </span>
      </Link>

      <nav className="primary-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <Link href="/advanced-search" className="icon-button" aria-label="Search">
          <Search size={18} />
        </Link>
        {user ? (
          <>
            <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="user-chip">
              <ShieldCheck size={16} />
              {user.name}
            </Link>
            <button className="icon-button" type="button" onClick={logout} aria-label="Log out">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-link">
              Log In
            </Link>
            <Link href="/sign-up" className="button button-small">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
