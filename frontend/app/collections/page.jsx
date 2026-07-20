import { ArchiveItemCard } from "@/components/archive-item-card";
import { CollectionCard } from "@/components/collection-card";
import { SectionHeading } from "@/components/section-heading";
import { getArchiveItemFeed, getCollections } from "@/services/archive-service";

export default async function CollectionsPage() {
  const [collections, archiveItemFeed] = await Promise.all([
    getCollections(),
    getArchiveItemFeed({ limit: 12 })
  ]);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Collections</p>
        <h1>Browse the Archive</h1>
        <p>
          Explore books, manuscripts, photographs, oral histories, artifacts, and
          ephemera organized for discovery across topics, regions, and periods.
        </p>
      </section>
      <section>
        <SectionHeading title="All Collections" />
        <div className="collection-grid expanded">
          {collections.map((collection) => (
            <CollectionCard collection={collection} key={collection.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}

