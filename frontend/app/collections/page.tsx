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
      {/* <section className="archive-catalog-section" id="new-additions">
        <SectionHeading
          eyebrow="From the archive database"
          title="New Additions"
          actionHref="/advanced-search"
          actionLabel="Search all records →"
        />
        {archiveItemFeed.unavailable ? (
          <p className="error-banner" role="alert">
            Public archive items are temporarily unavailable.
          </p>
        ) : archiveItemFeed.items.length ? (
          <div className="archive-record-grid">
            {archiveItemFeed.items.map((item) => (
              <ArchiveItemCard item={item} key={item.slug} />
            ))}
          </div>
        ) : (
          <p className="notice">No public archive items have been added yet.</p>
        )}
      </section> */}
    </main>
  );
}
