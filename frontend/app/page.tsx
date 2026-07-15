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
import { HeroSearch } from "@/components/hero-search";
import { archivePillars, exploreTools } from "@/lib/archive-data";
import {
  getCommunityHighlights,
  getFeaturedCollections,
  getLearningResources
} from "@/services/archive-service";

const toolIcons = [Search, LibraryBig, Clock3, MapPinned];
const pillarIcons = [BookOpen, LibraryBig, UsersRound, GraduationCap];
const collectionCrops = [
  "crop-rare",
  "crop-manuscripts",
  "crop-photos",
  "crop-oral",
  "crop-artifacts"
];
const communityPhotoCrops = ["crop-amina", "crop-marcus", "crop-leah"];
const resourceCrops = [
  "crop-teaching",
  "crop-guides",
  "crop-webinars",
  "crop-exhibitions"
];

export default async function HomePage() {
  const [collections, resources, community] = await Promise.all([
    getFeaturedCollections(),
    getLearningResources(),
    getCommunityHighlights()
  ]);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-art" aria-hidden="true" />
        <div className="hero-content">
          <h1>
            <span>Preserving Our Heritage.</span>
            <em>Inspiring Our Future.</em>
          </h1>
          <p className="hero-lede">
            Mahogany Archives preserves and provides access to books, texts,
            oral histories, photographs, and cultural materials from across the
            African Diaspora and beyond.
          </p>
          <HeroSearch />
          <Link href="/advanced-search" className="advanced-link">
            Advanced Search
          </Link>
        </div>
      </section>

      <section className="home-pillar-band">
        {archivePillars.map((pillar, index) => {
          const Icon = pillarIcons[index];
          return (
            <div className="home-pillar" key={pillar.title}>
              <Icon size={27} strokeWidth={1.5} />
              <div>
                <h2>{pillar.title}</h2>
                <p>{pillar.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="home-section home-featured">
        <div className="home-section-heading">
          <div className="home-title-rule">
            <h2>Featured Collections</h2>
            <span />
          </div>
          <Link href="/collections">View all collections</Link>
        </div>
        <div className="home-collection-grid">
          {collections.slice(0, 5).map((collection, index) => (
            <Link
              href={`/collections/${collection.slug}`}
              className="home-collection-card"
              key={collection.slug}
            >
              <span className={`home-reference-crop ${collectionCrops[index]}`} />
              <span className="home-card-body">
                <strong>{collection.title}</strong>
                <small>{collection.itemCount.toLocaleString()} items</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-explore-band">
        <div className="home-explore-intro">
          <h2>Discover &amp; Explore</h2>
          <p>
            Powerful tools to help you find, organize, and engage with archival
            materials.
          </p>
          <Link href="/advanced-search" className="button">
            Go to Advanced Search
          </Link>
        </div>
        <div className="home-tool-grid">
          {exploreTools.map((tool, index) => {
            const Icon = toolIcons[index];
            return (
              <Link href={tool.href} className="home-tool" key={tool.title}>
                <Icon size={29} strokeWidth={1.4} />
                <strong>{tool.title}</strong>
                <span>{tool.description}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-section home-community-section">
        <div className="home-section-heading">
          <h2>Our Community</h2>
          <Link href="/community">Meet the Community</Link>
        </div>
        <div className="home-community-strip">
          <div className="home-community-join">
            <UsersRound size={25} strokeWidth={1.4} />
            <h3>A Global Community of Researchers, Educators, and Storytellers</h3>
            <p>Join thousands of members contributing to a living archive.</p>
            <Link href="/community" className="button button-light">
              Join the Community
            </Link>
          </div>
          {community.map((member, index) => (
            <div className="home-community-pair" key={member.name}>
              <span className={`home-reference-crop ${communityPhotoCrops[index]}`} />
              <article>
              <h3>{member.name}</h3>
              <span>{member.role}</span>
              <p>{member.quote}</p>
            </article>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section home-learn">
        <div className="home-section-heading">
          <h2>Learn &amp; Grow</h2>
          <Link href="/learn">Explore all resources</Link>
        </div>
        <div className="home-resource-grid">
          {resources.slice(0, 4).map((resource, index) => (
            <Link
              key={resource.title}
              href={resource.href}
              className={`home-resource-card ${resourceCrops[index]}`}
            >
              <GraduationCap size={20} strokeWidth={1.4} />
              <strong>{resource.title}</strong>
              <span>{resource.description}</span>
              <small>
                {index === 0
                  ? "Browse Resources"
                  : index === 1
                    ? "View Guides"
                    : index === 2
                      ? "See Upcoming Events"
                      : "View Exhibitions"}
              </small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
