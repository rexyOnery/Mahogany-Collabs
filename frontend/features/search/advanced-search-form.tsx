"use client";

import { FormEvent, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { fallbackCollections } from "@/lib/archive-data";

export function AdvancedSearchForm() {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("All formats");
  const [period, setPeriod] = useState("Any period");
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return fallbackCollections.filter((collection) => {
      const matchesText =
        !normalized ||
        collection.title.toLowerCase().includes(normalized) ||
        collection.description.toLowerCase().includes(normalized);
      const matchesFormat = format === "All formats" || collection.category === format;
      return matchesText && matchesFormat;
    });
  }, [format, query]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
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
          Period
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option>Any period</option>
            <option>1750-1850</option>
            <option>1850-1950</option>
            <option>1950-present</option>
          </select>
        </label>
        <button className="button" type="submit">
          <Search size={18} />
          Search Archive
        </button>
      </form>

      <section className="results-panel" aria-live="polite">
        <div className="results-heading">
          <Filter size={20} />
          <h2>{submitted ? `${results.length} matching records` : "Search preview"}</h2>
        </div>
        {results.map((collection) => (
          <article key={collection.slug} className="result-row">
            <span>{collection.category}</span>
            <div>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
