import { AdvancedSearchForm } from "@/features/search/advanced-search-form";

const firstValue = (value) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const legacyMaterialTypes = {
  books: "Books",
  manuscripts: "Manuscripts",
  images: "Images"
};

export default async function AdvancedSearchPage({ searchParams }) {
  const query = await searchParams;
  const initialSearch = firstValue(query.search || query.query).trim();
  const requestedMaterialType = firstValue(query.materialType).trim();
  const legacyCollection = firstValue(query.collection).trim().toLowerCase();
  const initialMaterialType =
    requestedMaterialType || legacyMaterialTypes[legacyCollection] || "";

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
      <AdvancedSearchForm
        initialSearch={initialSearch}
        initialMaterialType={initialMaterialType}
        initialRegion={firstValue(query.region).trim()}
        initialLanguage={firstValue(query.language).trim()}
      />
    </main>
  );
}

