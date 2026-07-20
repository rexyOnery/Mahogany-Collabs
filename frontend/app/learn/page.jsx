import { BookOpen, CalendarDays, GraduationCap, Images } from "lucide-react";
import { InfoCard } from "@/components/info-card";
import { getLearningResources } from "@/services/archive-service";

const icons = [GraduationCap, BookOpen, CalendarDays, Images];

export default async function LearnPage() {
  const resources = await getLearningResources();

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Learn</p>
        <h1>Resources for classrooms and research</h1>
        <p>
          Use curated guides, events, and exhibitions to make archive materials
          teachable, searchable, and alive in public memory.
        </p>
      </section>
      <section className="resource-grid">
        {resources.map((resource, index) => {
          const Icon = icons[index] || BookOpen;
          return (
            <InfoCard
              key={resource.title}
              icon={<Icon size={24} />}
              title={resource.title}
              description={resource.description}
              href={resource.href}
              actionLabel="View"
            />
          );
        })}
      </section>
    </main>
  );
}

