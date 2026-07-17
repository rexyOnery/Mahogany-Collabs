import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Globe2, MapPinned, Tag } from "lucide-react";
import { archiveImageUrl, getArchiveItem } from "@/services/archive-service";

export default async function ArchiveItemDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getArchiveItem(slug);

  if (!item) {
    notFound();
  }

  const metadataRows = [
    ["Creator", item.creator],
    ["Date or period", item.dateOrPeriod],
    ["Country", item.country],
    ["Region", item.region],
    ["Community or place", item.community],
    ["Language", item.language],
    ["Source or donor", item.sourceOrDonor],
    ["Rights", item.rightsStatus],
    ["Access", item.accessLevel],
    ["Image format", `${item.image.format.toUpperCase()} · ${item.image.width} x ${item.image.height}px`]
  ].filter(([, value]) => value);

  return (
    <main className="page-shell">
      <Link href="/advanced-search" className="text-link back-link">
        <ArrowLeft size={16} />
        Search archive
      </Link>

      <section className="archive-item-layout">
        <figure className="archive-item-media">
          <img src={archiveImageUrl(item)} alt={item.altText} />
          {item.caption ? <figcaption>{item.caption}</figcaption> : null}
        </figure>

        <article className="archive-item-copy">
          <p className="eyebrow">{item.materialType}</p>
          <h1>{item.title}</h1>
          <p className="archive-item-lede">{item.shortDescription}</p>
          <div className="archive-access-note">
            <strong>{item.accessLevel === "public" ? "Public record" : "Restricted record"}</strong>
            <span>{item.rightsStatus}</span>
          </div>
          <p>{item.publicContent}</p>

          {item.culturalSensitivityLabel ? (
            <p className="notice">{item.culturalSensitivityLabel}</p>
          ) : null}
        </article>
      </section>

      <section className="archive-metadata-panel">
        <h2>Archive metadata</h2>
        <dl>
          {metadataRows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="archive-tags-panel">
        <h2>Discovery context</h2>
        <div className="tag-row">
          <span>
            <Calendar size={16} />
            {item.dateOrPeriod || "Date not specified"}
          </span>
          <span>
            <MapPinned size={16} />
            {item.region || item.country || "Place not specified"}
          </span>
          <span>
            <Globe2 size={16} />
            {item.language || "Language not specified"}
          </span>
        </div>
        {[...item.subjectTags, ...item.keywords].length ? (
          <div className="tag-row">
            {[...item.subjectTags, ...item.keywords].map((tag) => (
              <span key={tag}>
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
