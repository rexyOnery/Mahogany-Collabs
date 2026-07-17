"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { archiveImageUrl, searchArchiveItems } from "@/services/archive-service";
import type { ArchiveItem } from "@/types/archive";

export function AdvancedSearchForm() {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("All formats");
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const items = await searchArchiveItems({
        search: query,
        materialType: format === "All formats" ? undefined : format,
        region,
        language,
        limit: 30
      });
      setResults(items);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch();
    // Load the newest public records once on first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    runSearch();
  };

  return (
    <div className="search-workspace">
      <form className="search-panel" onSubmit={onSubmit}>
        <label>
          Keyword
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Names, places, titles, subjects"
          />
        </label>
        <label>
          Format
          <select value={format} onChange={(event) => setFormat(event.target.value)}>
            <option>All formats</option>
            <option>Books</option>
            <option>Manuscripts</option>
            <option>Images</option>
            <option>Audio</option>
            <option>Objects</option>
          </select>
        </label>
        <label>
          Region
          <input
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            placeholder="West Africa, Caribbean..."
          />
        </label>
        <label>
          Language
          <input
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            placeholder="Yoruba, English..."
          />
        </label>
        <button className="button" type="submit">
          <Search size={18} />
          Search Archive
        </button>
      </form>

      <section className="results-panel" aria-live="polite">
        <div className="results-heading">
          <Filter size={20} />
          <h2>{submitted ? `${results.length} matching records` : "Newest public records"}</h2>
        </div>
        {loading ? <p className="notice">Searching the archive...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
        {!loading && results.length === 0 ? (
          <p className="notice">No public archive items match those filters yet.</p>
        ) : null}
        {results.map((item) => (
          <Link key={item.slug} href={`/archive/${item.slug}`} className="result-row archive-result-row">
            <img src={archiveImageUrl(item)} alt={item.altText} />
            <span>{item.materialType}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.shortDescription}</p>
              <small>
                {[item.creator, item.region, item.language].filter(Boolean).join(" · ")}
              </small>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
