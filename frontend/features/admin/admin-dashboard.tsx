"use client";

import { useEffect, useState } from "react";
import { Archive, ClipboardCheck, Database, ShieldCheck } from "lucide-react";
import { InfoCard } from "@/components/info-card";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { ArchiveItemUploadForm } from "./archive-item-upload-form";

type Summary = {
  collections: number;
  published: number;
  archiveItems: number;
  pendingSubmissions: number;
  preservationQueue: number;
  recentActivity: string[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8090";

export function AdminDashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        setSummary(payload.data);
      })
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <ProtectedRoute requireRole="admin">
      <main className="page-shell dashboard-shell">
        <section className="page-hero compact-hero">
          <p className="eyebrow">Admin Service</p>
          <h1>Archive Operations</h1>
          <p>
            Manage collections, review submissions, and monitor the publication
            pipeline through protected Admin Service endpoints.
          </p>
        </section>

        {loading ? <p className="notice">Loading admin dashboard...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}

        <section className="grid-4">
          <InfoCard
            icon={<Archive size={24} />}
            title="Collections"
            description={`${summary?.collections ?? 0} total archive collections`}
          />
          <InfoCard
            icon={<Database size={24} />}
            title="Public Items"
            description={`${summary?.archiveItems ?? 0} searchable image records`}
          />
          <InfoCard
            icon={<ClipboardCheck size={24} />}
            title="Submissions"
            description={`${summary?.pendingSubmissions ?? 0} community submissions pending`}
          />
          <InfoCard
            icon={<ShieldCheck size={24} />}
            title="Preservation Queue"
            description={`${summary?.preservationQueue ?? 0} items awaiting review`}
          />
        </section>

        <ArchiveItemUploadForm />

        <section className="activity-panel">
          <h2>Recent Activity</h2>
          {(summary?.recentActivity ?? []).map((item) => (
            <p key={item}>{item}</p>
          ))}
        </section>
      </main>
    </ProtectedRoute>
  );
}
