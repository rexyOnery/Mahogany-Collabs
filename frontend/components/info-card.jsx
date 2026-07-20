import Link from "next/link";

export function InfoCard({
  icon,
  title,
  description,
  href,
  actionLabel = "Open"
}) {
  const content = (
    <>
      {icon ? <div className="info-icon">{icon}</div> : null}
      <h3>{title}</h3>
      <p>{description}</p>
      {href ? <span className="inline-action">{actionLabel}</span> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="info-card">
        {content}
      </Link>
    );
  }

  return <div className="info-card">{content}</div>;
}

