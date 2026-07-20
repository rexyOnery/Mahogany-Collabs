import Image from "next/image";
import Link from "next/link";
import { ArchiveItemCard } from "@/components/archive-item-card";
import { FeaturedCollectionsCarousel } from "@/components/featured-collections-carousel";
import { HeroSearch } from "@/components/hero-search";
import { archivePillars, exploreTools } from "@/lib/archive-data";
import {
  getCommunityHighlights,
  getArchiveItemFeed,
  getFeaturedCollections,
  getLearningResources
} from "@/services/archive-service";

const missionSymbols = ["▤", "◎", "♙", "⌂"];
const exploreSymbols = ["◉", "▥", "◷", "⌖"];

const communityImages = [
  {
    src: "/images/mahogany-archives/community-amina.jpg",
    alt: "Portrait of Dr. Amina Johnson",
    width: 87
  },
  {
    src: "/images/mahogany-archives/community-marcus.jpg",
    alt: "Portrait of Marcus Thompson",
    width: 85
  },
  {
    src: "/images/mahogany-archives/community-leah.jpg",
    alt: "Portrait of Leah Mensah",
    width: 87
  }
];

const learningImages = [
  {
    src: "/images/mahogany-archives/learn-teaching.jpg",
    alt: "Archive classroom",
    width: 199
  },
  {
    src: "/images/mahogany-archives/learn-research.jpg",
    alt: "Open book and coffee",
    width: 198
  },
  {
    src: "/images/mahogany-archives/learn-webinars.jpg",
    alt: "Microphone for webinars",
    width: 198
  },
  {
    src: "/images/mahogany-archives/learn-exhibitions.jpg",
    alt: "Museum exhibition gallery",
    width: 187
  }
];

const resourceActions = [
  "Browse Resources",
  "View Guides",
  "See Upcoming Events",
  "View Exhibitions"
];

export default async function HomePage() {
  const [collections, archiveItemFeed, resources, community] = await Promise.all([
    getFeaturedCollections(),
    getArchiveItemFeed({ limit: 4 }),
    getLearningResources(),
    getCommunityHighlights()
  ]);

  return (
    <main className="matched-home">
      <section className="matched-hero">
        <div className="matched-hero-copy">
          <h1>
            Preserving Our Heritage.
            <br />
            <em>Inspiring Our Future.</em>
          </h1>
          <p>
            Mahogany Archives preserves and provides access to books, texts,
            oral histories, photographs, and cultural materials from across the
            African Diaspora and beyond.
          </p>
          <HeroSearch />
          <Link href="/advanced-search" className="matched-advanced-link">
            Advanced Search <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <div
          className="matched-hero-image"
          role="img"
          aria-label="Antique books, archival portrait, catalogue card and manuscript"
        />
      </section>

      <section className="matched-mission-strip" aria-label="Our mission">
        {archivePillars.map((pillar, index) => (
          <article key={pillar.title}>
            <span aria-hidden="true">{missionSymbols[index]}</span>
            <div>
              <h2>{pillar.title}</h2>
              <p>{pillar.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section id="collections" className="matched-section">
        <div className="matched-section-heading">
          <h2>Featured Collections</h2>
          <Link href="/collections">View all collections →</Link>
        </div>
        <FeaturedCollectionsCarousel collections={collections} />
      </section>

      <section id="explore" className="matched-explore-band">
        <div className="matched-explore-intro">
          <h2>Discover &amp; Explore</h2>
          <p>
            Powerful tools to help you find, organize, and engage with archival
            materials.
          </p>
          <Link className="matched-button" href="/advanced-search">
            Go to Advanced Search
          </Link>
        </div>

        {exploreTools.map((tool, index) => (
          <article key={tool.title}>
            <span aria-hidden="true">{exploreSymbols[index]}</span>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
          </article>
        ))}
      </section>

      <section id="community" className="matched-section">
        <div className="matched-section-heading">
          <h2>Our Community</h2>
          <Link href="/community">Meet the Community →</Link>
        </div>

        <div className="matched-community-grid">
          <article className="matched-join-card">
            <h3>
              A Global Community
              <br />
              of Researchers, Educators,
              <br />
              and Storytellers
            </h3>
            <p>Join thousands of members contributing to a living archive.</p>
            <Link className="matched-button matched-button-light" href="/community">
              Join the Community
            </Link>
          </article>

          {community.slice(0, 3).map((member, index) => {
            const image = communityImages[index];
            return (
              <article className="matched-person-card" key={member.name}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={119}
                />
                <div>
                  <h3>{member.name}</h3>
                  <small>{member.role}</small>
                  <blockquote>&ldquo;{member.quote}&rdquo;</blockquote>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="learn" className="matched-section matched-learn-section">
        <div className="matched-section-heading">
          <h2>Learn &amp; Grow</h2>
          <Link href="/learn">Explore all resources →</Link>
        </div>

        <div className="matched-learn-grid">
          {resources.slice(0, 4).map((resource, index) => {
            const image = learningImages[index];
            return (
              <article className="matched-learn-card" key={resource.title}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={98}
                />
                <div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <Link href={resource.href}>{resourceActions[index]} →</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

