"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("all");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (collection !== "all") params.set("collection", collection);
    router.push(`/advanced-search?${params.toString()}`);
  };

  return (
    <form className="hero-search" onSubmit={onSubmit}>
      <input
        aria-label="Search archive collection"
        placeholder="Search the Mahogany Archives collection..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <label className="select-wrap">
        <span className="sr-only">Collection filter</span>
        <select value={collection} onChange={(event) => setCollection(event.target.value)}>
          <option value="all">All Collections</option>
          <option value="books">Books</option>
          <option value="manuscripts">Manuscripts</option>
          <option value="images">Images</option>
          <option value="audio">Audio</option>
        </select>
        <ChevronDown size={16} />
      </label>
      <button type="submit" aria-label="Search">
        <Search size={18} />
      </button>
    </form>
  );
}
