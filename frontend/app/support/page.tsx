import Link from "next/link";
import { LifeBuoy, PackagePlus, ShieldCheck } from "lucide-react";
import { InfoCard } from "@/components/info-card";

export default function SupportPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Support</p>
        <h1>Help sustain the archive</h1>
        <p>
          Support preservation, submit materials, or contact the team for access
          and partnership questions.
        </p>
      </section>
      <section className="grid-3">
        <InfoCard
          icon={<PackagePlus size={24} />}
          title="Submit Materials"
          description="Begin a review request for photographs, letters, recordings, or ephemera."
          href="/sign-up"
          actionLabel="Start"
        />
        <InfoCard
          icon={<ShieldCheck size={24} />}
          title="Access Help"
          description="Get help with account access, permissions, and research requests."
          href="mailto:support@example.com"
          actionLabel="Email"
        />
        <InfoCard
          icon={<LifeBuoy size={24} />}
          title="Volunteer"
          description="Assist with transcription, metadata enrichment, and community outreach."
          href="/community"
          actionLabel="Join"
        />
      </section>
      <section className="support-panel">
        <h2>Production Deployment</h2>
        <p>
          The frontend is configured for Vercel. Backend services can be deployed
          as containers behind the API Gateway URL configured in Vercel.
        </p>
        <Link href="/advanced-search" className="button">
          Explore Archive
        </Link>
      </section>
    </main>
  );
}
