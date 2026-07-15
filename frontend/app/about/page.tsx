import { Globe2, HeartHandshake, Landmark } from "lucide-react";
import { InfoCard } from "@/components/info-card";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">About</p>
        <h1>Preservation with context and care</h1>
        <p>
          Mahogany Archives is a sample platform for protecting rare cultural
          materials while making discovery open, respectful, and useful.
        </p>
      </section>
      <section className="grid-3">
        <InfoCard
          icon={<Landmark size={24} />}
          title="Our Mission"
          description="Preserve rare and at-risk materials while honoring their source communities."
        />
        <InfoCard
          icon={<Globe2 size={24} />}
          title="Our Reach"
          description="Connect institutions, classrooms, researchers, and families across regions."
        />
        <InfoCard
          icon={<HeartHandshake size={24} />}
          title="Our Partners"
          description="Work with libraries, museums, educators, and local archive stewards."
        />
      </section>
    </main>
  );
}
