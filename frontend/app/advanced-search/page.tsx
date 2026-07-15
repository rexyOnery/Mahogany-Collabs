import { AdvancedSearchForm } from "@/features/search/advanced-search-form";

export default function AdvancedSearchPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Advanced Search</p>
        <h1>Search across collections</h1>
        <p>
          Refine discovery by format, period, creator, subject, region, and
          keywords across the archive catalog.
        </p>
      </section>
      <AdvancedSearchForm />
    </main>
  );
}
