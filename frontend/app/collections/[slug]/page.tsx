import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPinned } from "lucide-react";
import { getCollection } from "@/services/archive-service";

export default async function CollectionDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

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
          <span>{collection.itemCount.toLocaleString()} items</span>
          <span>{collection.period}</span>
          <span>
            <MapPinned size={16} />
            {collection.region}
          </span>
        </aside>
      </section>
      <section className="record-list">
        <h2>Sample Records</h2>
        {["Catalog card", "Digitized object", "Research note"].map((record) => (
          <article key={record} className="result-row">
            <span>{collection.category}</span>
            <div>
              <h3>{record}</h3>
              <p>
                A representative archive record connected to {collection.title}.
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
