import {
  BookOpen,
  Clock3,
  FileText,
  GraduationCap,
  ImageIcon,
  LibraryBig,
  MapPinned,
  PlayCircle,
  Search,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { HeroSearch } from "@/components/hero-search";
import { archivePillars, exploreTools } from "@/lib/archive-data";
import {
  getCommunityHighlights,
  getFeaturedCollections,
  getLearningResources
} from "@/services/archive-service";

const pillarIcons = [BookOpen, LibraryBig, UsersRound, GraduationCap];
const toolIcons = [Search, LibraryBig, Clock3, MapPinned];
const collectionStyles = ["books", "letters", "photos", "oral", "artifacts"];
const resourceIcons = [FileText, BookOpen, PlayCircle, ImageIcon];

export default async function HomePage() {
  const [collections, resources, community] = await Promise.all([
    getFeaturedCollections(),
    getLearningResources(),
    getCommunityHighlights()
  ]);

  return (
    <main className="archive-home">
      <section className="archive-hero">
        <div className="archive-container archive-hero-inner">
          <div className="archive-hero-copy">
            <span className="archive-eyebrow-line" aria-hidden="true" />
            <h1>
              Preserving Our Heritage.
              <br />
              <em>Inspiring Our Future.</em>
            </h1>
            <p>
              Mahogany Archives preserves and provides access to books, texts,
              oral histories, photographs, and cultural materials from across
              the African Diaspora and beyond.
            </p>
            <HeroSearch />
            <Link href="/advanced-search" className="archive-advanced-link">
              Advanced Search <span aria-hidden="true">⌄</span>
            </Link>
          </div>

          <div className="archive-hero-art" aria-hidden="true">
            <div className="archive-shelf" />
            <div className="archive-portrait" />
            <div className="archive-catalog-card">
              <strong>Catalog Card</strong>
              <span>Title __________________</span>
              <span>Creator _______________</span>
              <span>Date __________________</span>
              <span>Collection _____________</span>
            </div>
          </div>
        </div>
      </section>

      <section className="archive-mission" aria-label="Our mission">
        <div className="archive-container archive-mission-grid">
          {archivePillars.map((pillar, index) => {
            const Icon = pillarIcons[index];
            return (
              <article className="archive-mission-item" key={pillar.title}>
                <Icon size={34} strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <h2>{pillar.title}</h2>
                  <p>{pillar.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="archive-section">
        <div className="archive-container">
          <div className="archive-section-head">
            <h2>Featured Collections</h2>
            <Link href="/collections">View all collections →</Link>
          </div>
          <div className="archive-collections-grid">
            {collections.slice(0, 5).map((collection, index) => (
              <Link
                href={`/collections/${collection.slug}`}
                className="archive-collection-card"
                key={collection.slug}
              >
                <span
                  className={`archive-collection-thumb ${collectionStyles[index]}`}
                  aria-hidden="true"
                />
                <span className="archive-collection-info">
                  <strong>{collection.title}</strong>
                  <small>{collection.itemCount.toLocaleString("en-US")} items</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="archive-section archive-discover">
        <div className="archive-container archive-discover-grid">
          <div className="archive-discover-intro">
            <span className="archive-eyebrow">Discover &amp; Explore</span>
            <h2>
              Powerful tools to help you find, organize, and engage with
              archival materials.
            </h2>
            <Link href="/advanced-search" className="archive-primary-button">
              Go to Advanced Search
            </Link>
          </div>

          {exploreTools.map((tool, index) => {
            const Icon = toolIcons[index];
            return (
              <Link href={tool.href} className="archive-tool-item" key={tool.title}>
                <h3>
                  <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
                  {tool.title}
                </h3>
                <p>{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="archive-section">
        <div className="archive-container">
          <div className="archive-section-head">
            <h2>Our Community</h2>
            <Link href="/community">Meet the Community →</Link>
          </div>

          <div className="archive-community-grid">
            <article className="archive-community-intro">
              <UsersRound size={30} strokeWidth={1.6} aria-hidden="true" />
              <h3>A Global Community of Researchers, Educators, and Storytellers</h3>
              <p>Join thousands of members contributing to a living archive.</p>
              <Link href="/community" className="archive-light-button">
                Join the Community
              </Link>
            </article>

            {community.slice(0, 3).map((member, index) => (
              <article className="archive-member" key={member.name}>
                <span
                  className={`archive-member-avatar avatar-${index + 1}`}
                  aria-hidden="true"
                />
                <h3>{member.name}</h3>
                <span className="archive-member-role">{member.role}</span>
                <p>“{member.quote}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="archive-section archive-learn-section">
        <div className="archive-container">
          <div className="archive-section-head">
            <h2>Learn &amp; Grow</h2>
            <Link href="/learn">Explore all resources →</Link>
          </div>

          <div className="archive-learn-grid">
            {resources.slice(0, 4).map((resource, index) => {
              const Icon = resourceIcons[index];
              const action = [
                "Browse Resources",
                "View Guides",
                "See Upcoming Events",
                "View Exhibitions"
              ][index];

              return (
                <Link href={resource.href} className="archive-learn-card" key={resource.title}>
                  <span
                    className={`archive-learn-thumb thumb-${index + 1}`}
                    aria-hidden="true"
                  />
                  <span className="archive-learn-body">
                    <strong>
                      <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                      {resource.title}
                    </strong>
                    <span>{resource.description}</span>
                    <small>{action} →</small>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
