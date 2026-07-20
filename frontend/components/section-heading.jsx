import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  actionHref,
  actionLabel
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="text-link">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

