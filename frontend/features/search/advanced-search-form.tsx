"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Search } from "lucide-react";
import { ArchiveItemCard } from "@/components/archive-item-card";
import { FieldHelpLabel, useFieldHelp } from "@/components/field-help-label";
import { searchArchiveItems } from "@/services/archive-service";
import type { ArchiveItem } from "@/types/archive";

const allFormats = "All formats";
const materialTypes = [
  "Books",
  "Manuscripts",
  "Images",
  "Audio",
  "Objects",
  "Maps",
  "Language",
  "Research"
];

const searchFieldHelpText = {
  keyword:
    "Search public record text such as titles, descriptions, creators, dates, places, subjects, tags, and other catalog details.",
  format:
    "Limit results to records with the selected material type. Choose All formats to include every type.",
  region:
    "Limit results to the full region recorded for an item, such as West Africa or Caribbean. Capitalization does not matter.",
  language:
    "Limit results to the full language recorded for an item, such as Yoruba or English. Capitalization does not matter."
} as const;

type SearchFieldHelpKey = keyof typeof searchFieldHelpText;

type AdvancedSearchFormProps = {
  initialSearch?: string;
  initialMaterialType?: string;
  initialRegion?: string;
  initialLanguage?: string;
};

export function AdvancedSearchForm({
  initialSearch = "",
  initialMaterialType = "",
  initialRegion = "",
  initialLanguage = ""
}: AdvancedSearchFormProps) {
  const router = useRouter();
  const normalizedInitialFormat = materialTypes.includes(initialMaterialType)
    ? initialMaterialType
    : allFormats;
  const hasInitialFilters = Boolean(
    initialSearch ||
      initialRegion ||
      initialLanguage ||
      normalizedInitialFormat !== allFormats
  );
  const [query, setQuery] = useState(initialSearch);
  const [format, setFormat] = useState(normalizedInitialFormat);
  const [region, setRegion] = useState(initialRegion);
  const [language, setLanguage] = useState(initialLanguage);
  const [submitted, setSubmitted] = useState(hasInitialFilters);
  const [results, setResults] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { openHelp, toggleHelp } = useFieldHelp<SearchFieldHelpKey>();

  const runSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const items = await searchArchiveItems({
        search: query,
        materialType: format === allFormats ? undefined : format,
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
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (format !== allFormats) params.set("materialType", format);
    if (region.trim()) params.set("region", region.trim());
    if (language.trim()) params.set("language", language.trim());
    const queryString = params.toString();
    router.replace(queryString ? `/advanced-search?${queryString}` : "/advanced-search", {
      scroll: false
    });
    void runSearch();
  };

  return (
    <div className="search-workspace">
      <form className="search-panel" onSubmit={onSubmit}>
        <div className="search-form-field">
          <FieldHelpLabel
            fieldId="advanced-search-keyword"
            helpKey="keyword"
            label="Keyword"
            description={searchFieldHelpText.keyword}
            openHelp={openHelp}
            onToggle={toggleHelp}
          />
          <input
            id="advanced-search-keyword"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Names, places, titles, subjects"
          />
        </div>
        <div className="search-form-field">
          <FieldHelpLabel
            fieldId="advanced-search-format"
            helpKey="format"
            label="Format"
            description={searchFieldHelpText.format}
            openHelp={openHelp}
            onToggle={toggleHelp}
          />
          <select
            id="advanced-search-format"
            value={format}
            onChange={(event) => setFormat(event.target.value)}
          >
            <option>{allFormats}</option>
            {materialTypes.map((materialType) => (
              <option key={materialType}>{materialType}</option>
            ))}
          </select>
        </div>
        <div className="search-form-field">
          <FieldHelpLabel
            fieldId="advanced-search-region"
            helpKey="region"
            label="Region"
            description={searchFieldHelpText.region}
            openHelp={openHelp}
            onToggle={toggleHelp}
          />
          <input
            id="advanced-search-region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            placeholder="West Africa, Caribbean..."
          />
        </div>
        <div className="search-form-field">
          <FieldHelpLabel
            fieldId="advanced-search-language"
            helpKey="language"
            label="Language"
            description={searchFieldHelpText.language}
            openHelp={openHelp}
            onToggle={toggleHelp}
          />
          <input
            id="advanced-search-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            placeholder="Yoruba, English..."
          />
        </div>
        <button className="button" type="submit">
          <Search size={18} />
          Search Archive
        </button>
      </form>

      <section className="results-panel" aria-live="polite" aria-busy={loading}>
        <div className="results-heading">
          <Filter size={20} />
          <h2>
            {loading
              ? "Searching public records"
              : submitted
                ? `${results.length} matching records`
                : "Newest public records"}
          </h2>
        </div>
        {loading ? (
          <p className="notice" role="status">
            Searching the archive...
          </p>
        ) : null}
        {error ? (
          <p className="error-banner" role="alert">
            {error}
          </p>
        ) : null}
        {!loading && !error && results.length === 0 ? (
          <p className="notice">No public archive items match those filters yet.</p>
        ) : null}
        {results.map((item) => (
          <ArchiveItemCard key={item.slug} item={item} layout="row" />
        ))}
      </section>
    </div>
  );
}
