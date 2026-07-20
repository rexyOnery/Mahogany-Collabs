import Link from "next/link";
import { UsersRound } from "lucide-react";
import { getCommunityHighlights } from "@/services/archive-service";

export default async function CommunityPage() {
  const members = await getCommunityHighlights();

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Community</p>
        <h1>A living network of memory keepers</h1>
        <p>
          Researchers, families, educators, and community archivists contribute
          context that keeps the archive accountable to lived histories.
        </p>
      </section>
      <section className="community-strip standalone">
        <div className="community-join">
          <UsersRound size={28} />
          <h2>Join the Community</h2>
          <p>Share expertise, contribute metadata, or volunteer with preservation work.</p>
          <Link href="/sign-up" className="button button-light">
            Create Account
          </Link>
        </div>
        {members.map((member) => (
          <article className="quote-card" key={member.name}>
            <h3>{member.name}</h3>
            <span>{member.role}</span>
            <p>{member.quote}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

