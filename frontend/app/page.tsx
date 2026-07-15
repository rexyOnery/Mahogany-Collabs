import {
  BookOpen,
  Clock3,
  GraduationCap,
  LibraryBig,
  MapPinned,
  Search,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { CollectionCard } from "@/components/collection-card";
import { HeroSearch } from "@/components/hero-search";
import { InfoCard } from "@/components/info-card";
import { SectionHeading } from "@/components/section-heading";
import { archivePillars, exploreTools } from "@/lib/archive-data";
import {
  getCommunityHighlights,
  getFeaturedCollections,
  getLearningResources
} from "@/services/archive-service";

const toolIcons = [Search, LibraryBig, Clock3, MapPinned];

export default async function HomePage() {
  const [collections, resources, community] = await Promise.all([
    getFeaturedCollections(),
    getLearningResources(),
    getCommunityHighlights()
  ]);

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Digital Heritage Collection</p>
          <h1>Mahogany Archives</h1>
          <p className="hero-lede">
            Preserving our heritage and inspiring our future through books,
            photographs, oral histories, artifacts, and community memory.
          </p>
          <HeroSearch />
          <Link href="/advanced-search" className="advanced-link">
            Advanced Search
          </Link>
        </div>
      </section>

      <section className="pillar-band">
        {archivePillars.map((pillar, index) => {
          const icons = [BookOpen, LibraryBig, UsersRound, GraduationCap];
          const Icon = icons[index];
          return (
            <div className="pillar" key={pillar.title}>
              <Icon size={28} />
              <div>
                <h2>{pillar.title}</h2>
                <p>{pillar.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="content-section">
        <SectionHeading
          title="Featured Collections"
          actionHref="/collections"
          actionLabel="View all collections"
        />
        <div className="collection-grid">
          {collections.map((collection) => (
            <CollectionCard collection={collection} key={collection.slug} />
          ))}
        </div>
      </section>

      <section className="explore-band">
        <div className="explore-intro">
          <p className="eyebrow">Discover and Explore</p>
          <h2>Powerful tools for research and storytelling</h2>
          <Link href="/advanced-search" className="button">
            Go to Advanced Search
          </Link>
        </div>
        <div className="tool-grid">
          {exploreTools.map((tool, index) => {
            const Icon = toolIcons[index];
            return (
              <InfoCard
                key={tool.title}
                icon={<Icon size={26} />}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                actionLabel="Explore"
              />
            );
          })}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading
          title="Our Community"
          actionHref="/community"
          actionLabel="Meet the community"
        />
        <div className="community-strip">
          <div className="community-join">
            <UsersRound size={28} />
            <h3>A Global Community of Researchers, Educators, and Storytellers</h3>
            <p>Join members contributing to a living archive.</p>
            <Link href="/community" className="button button-light">
              Join the Community
            </Link>
          </div>
          {community.map((member) => (
            <article className="quote-card" key={member.name}>
              <h3>{member.name}</h3>
              <span>{member.role}</span>
              <p>{member.quote}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading
          title="Learn and Grow"
          actionHref="/learn"
          actionLabel="Explore all resources"
        />
        <div className="resource-grid">
          {resources.map((resource) => (
            <InfoCard
              key={resource.title}
              icon={<GraduationCap size={24} />}
              title={resource.title}
              description={resource.description}
              href={resource.href}
              actionLabel="Open"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
