import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPinned } from "lucide-react";
import { ArchiveItemCard } from "@/components/archive-item-card";
import { SectionHeading } from "@/components/section-heading";
import { getArchiveItemFeed, getCollection } from "@/services/archive-service";

export default async function CollectionDetailPage({ params }) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  const archiveItemFeed = await getArchiveItemFeed({
    materialType: collection.category,
    limit: 50
  });

  return (
    <main className="page-shell">
      <Link href="/collections" className="text-link back-link">
        <ArrowLeft size={16} />
        Collections
      </Link>
      <section className="detail-hero">
        <div>
          <p className="eyebrow">{collection.category}</p>
          <h1>{collection.title}</h1>
          <p>{collection.description}</p>
        </div>
        <aside className="detail-metadata">
          <span>
            {archiveItemFeed.unavailable
              ? "Online records unavailable"
              : `${archiveItemFeed.items.length} online ${
                  archiveItemFeed.items.length === 1 ? "record" : "records"
                }`}
          </span>
          <span>{collection.period}</span>
          <span>
            <MapPinned size={16} />
            {collection.region}
          </span>
        </aside>
      </section>
      <section className="record-list">
        <SectionHeading
          eyebrow="From the archive database"
          title="Public Records"
          actionHref={`/advanced-search?materialType=${encodeURIComponent(
            collection.category
          )}`}
          actionLabel="Search this format →"
        />
        {archiveItemFeed.unavailable ? (
          <p className="error-banner" role="alert">
            Records for this collection are temporarily unavailable.
          </p>
        ) : archiveItemFeed.items.length ? (
          <div className="archive-record-grid">
            {archiveItemFeed.items.map((item) => (
              <ArchiveItemCard item={item} key={item.slug} />
            ))}
          </div>
        ) : (
          <p className="notice">
            No public {collection.category.toLowerCase()} records have been added yet.
          </p>
        )}
      </section>
    </main>
  );
}

