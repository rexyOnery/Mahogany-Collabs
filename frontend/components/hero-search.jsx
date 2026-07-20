"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [materialType, setMaterialType] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (materialType) params.set("materialType", materialType);
    const queryString = params.toString();
    router.push(queryString ? `/advanced-search?${queryString}` : "/advanced-search");
  };

  return (
    <form className="hero-search" onSubmit={onSubmit}>
      <input
        type="search"
        name="query"
        aria-label="Search archive collection"
        placeholder="Search the Mahogany Archives collection..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <label className="select-wrap">
        <span className="sr-only">Collection filter</span>
        <select
          name="materialType"
          value={materialType}
          onChange={(event) => setMaterialType(event.target.value)}
        >
          <option value="">All formats</option>
          <option value="Books">Books &amp; Texts</option>
          <option value="Manuscripts">Manuscripts</option>
          <option value="Images">Photographs</option>
          <option value="Audio">Oral histories</option>
          <option value="Objects">Objects</option>
          <option value="Maps">Maps</option>
          <option value="Language">Language</option>
          <option value="Research">Research</option>
        </select>
        <ChevronDown size={16} />
      </label>
      <button type="submit" aria-label="Search">
        <Search size={18} />
      </button>
    </form>
  );
}

