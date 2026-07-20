"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { getCollectionImage } from "@/lib/collection-images";

export function FeaturedCollectionsCarousel({
  collections
}) {
  const originals = collections.slice(0, 5);
  const trackRef = useRef(null);
  const currentIndexRef = useRef(0);
  const resetTimerRef = useRef(null);
  const scrollTimerRef = useRef(null);

  const cardStep = useCallback(() => {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild;
    if (!track || !firstCard) return 0;

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      trackRef.current?.scrollTo({
        left: currentIndexRef.current * cardStep(),
        behavior: "auto"
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    };
  }, [cardStep]);

  const resetToBeginning = () => {
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
    currentIndexRef.current = 0;
  };

  const showNextCollection = () => {
    if (!originals.length) return;
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);

    currentIndexRef.current += 1;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    trackRef.current?.scrollTo({
      left: currentIndexRef.current * cardStep(),
      behavior: reduceMotion ? "auto" : "smooth"
    });

    if (currentIndexRef.current >= originals.length) {
      resetTimerRef.current = window.setTimeout(
        resetToBeginning,
        reduceMotion ? 0 : 520
      );
    }
  };

  const syncScrollPosition = () => {
    if (currentIndexRef.current >= originals.length) return;
    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);

    scrollTimerRef.current = window.setTimeout(() => {
      const step = cardStep();
      if (trackRef.current && step) {
        currentIndexRef.current = Math.round(trackRef.current.scrollLeft / step);
      }
    }, 120);
  };

  const renderedCollections = [...originals, ...originals];

  return (
    <div className="matched-collection-carousel">
      <div
        ref={trackRef}
        className="matched-collection-grid"
        id="featured-collections-track"
        aria-label="Featured collections carousel"
        onScroll={syncScrollPosition}
      >
        {renderedCollections.map((collection, index) => {
          const clone = index >= originals.length;
          const image = getCollectionImage(collection);

          return (
            <Link
              href={`/collections/${collection.slug}`}
              className="matched-image-card"
              key={`${collection.slug}-${index}`}
              aria-hidden={clone || undefined}
              tabIndex={clone ? -1 : undefined}
            >
              <Image src={image.src} alt={clone ? "" : image.alt} width={159} height={98} />
              <span>
                <strong>{collection.title}</strong>
                <small>{collection.itemCount.toLocaleString("en-US")} items</small>
              </span>
            </Link>
          );
        })}
      </div>

      <button
        className="matched-collection-next"
        type="button"
        aria-label="Show next featured collection"
        aria-controls="featured-collections-track"
        onClick={showNextCollection}
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}

