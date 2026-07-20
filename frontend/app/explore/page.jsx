import { Clock3, Compass, LibraryBig, MapPinned, Search } from "lucide-react";
import { InfoCard } from "@/components/info-card";
import { exploreTools } from "@/lib/archive-data";

const icons = [Search, LibraryBig, Clock3, MapPinned];

export default function ExplorePage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Explore</p>
        <h1>Find the paths through the archive</h1>
        <p>
          Move by keyword, topic, time, and place to understand how individual
          records connect to broader cultural histories.
        </p>
      </section>
      <section className="grid-4">
        {exploreTools.map((tool, index) => {
          const Icon = icons[index];
          return (
            <InfoCard
              key={tool.title}
              icon={<Icon size={26} />}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              actionLabel="Open"
            />
          );
        })}
      </section>
      <section className="timeline-panel" id="timeline">
        <Compass size={28} />
        <h2>Timeline Explorer</h2>
        <div className="timeline">
          {["1750", "1865", "1920", "1968", "Present"].map((year) => (
            <span key={year}>{year}</span>
          ))}
        </div>
      </section>
    </main>
  );
}

