"use client";

import { Bookmark, Clock, Search, UserRound } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { InfoCard } from "@/components/info-card";
import { useAuth } from "@/hooks/use-auth";

export function UserDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="page-shell dashboard-shell">
        <section className="page-hero compact-hero">
          <p className="eyebrow">Member Workspace</p>
          <h1>Welcome back, {user?.name}</h1>
          <p>
            Continue your research, revisit saved materials, and track community
            contributions through the archive gateway.
          </p>
        </section>
        <section className="grid-4">
          <InfoCard
            icon={<Bookmark size={24} />}
            title="Saved Collections"
            description="12 collections saved for later review."
            href="/collections"
            actionLabel="Review"
          />
          <InfoCard
            icon={<Clock size={24} />}
            title="Recent Searches"
            description="Manuscripts, oral histories, and print culture."
            href="/advanced-search"
            actionLabel="Resume"
          />
          <InfoCard
            icon={<Search size={24} />}
            title="Research Queue"
            description="Five requests waiting for archivist follow-up."
            href="/support"
            actionLabel="Open"
          />
          <InfoCard
            icon={<UserRound size={24} />}
            title="Profile"
            description={user?.email || "Member profile"}
            href="/community"
            actionLabel="View"
          />
        </section>
      </main>
    </ProtectedRoute>
  );
}

