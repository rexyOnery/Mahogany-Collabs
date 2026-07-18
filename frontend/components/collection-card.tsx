import Image from "next/image";
import Link from "next/link";
import { getCollectionImage } from "@/lib/collection-images";
import type { Collection } from "@/types/archive";

export function CollectionCard({ collection }: { collection: Collection }) {
  const image = getCollectionImage(collection);

  return (
    <Link href={`/collections/${collection.slug}`} className="collection-card">
      <div className="collection-image">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 260px"
        />
      </div>
      <div className="collection-card-body">
        <h3>{collection.title}</h3>
        <p>{collection.itemCount.toLocaleString()} items</p>
      </div>
    </Link>
  );
}
