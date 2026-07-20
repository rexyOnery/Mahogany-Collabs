import Link from "next/link";
import { archiveImageUrl } from "@/services/archive-service";

export function ArchiveItemCard({
  item,
  layout = "card"
}) {
  const context = [item.creator, item.region || item.country, item.language]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/archive/${item.slug}`}
      className={`archive-record-card archive-record-card--${layout}`}
    >
      <div className="archive-record-card-media">
        <img
          src={archiveImageUrl(item)}
          alt={item.altText || item.title}
          loading={layout === "card" ? "lazy" : undefined}
        />
        <span>{item.materialType}</span>
      </div>
      <div className="archive-record-card-body">
        <h3>{item.title}</h3>
        <p>{item.shortDescription}</p>
        {context ? <small>{context}</small> : null}
      </div>
    </Link>
  );
}

