const curatedCollectionImages = {
  "artifacts-and-ephemera": {
    src: "/images/mahogany-archives/featured-artifacts.jpg",
    alt: "Historic indigo textile, carved wooden artifact, catalog cards, and paper ephemera"
  },
  "manuscripts-and-letters": {
    src: "/images/mahogany-archives/featured-manuscripts.jpg",
    alt: "Aged handwritten letters, sealed envelope, ink bottle, and dip pen"
  },
  "oral-histories": {
    src: "/images/mahogany-archives/featured-oral-history.jpg",
    alt: "Vintage ribbon microphone, reel-to-reel recorder, and interview notebook"
  },
  "photographs-and-prints": {
    src: "/images/mahogany-archives/featured-photographs.jpg",
    alt: "Album of historic sepia portraits and mounted family photographs"
  },
  "rare-books-and-texts": {
    src: "/images/mahogany-archives/featured-books.jpg",
    alt: "Weathered leather-bound books and an open volume on an archival table"
  }
};

export const getCollectionImage = (collection) =>
  curatedCollectionImages[collection.slug] || {
    src: collection.imageUrl || "/images/ebony.jpeg",
    alt: `${collection.title} collection`
  };

