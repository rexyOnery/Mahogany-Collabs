export type Collection = {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  itemCount: number;
  imageUrl: string;
  region: string;
  period: string;
  status: "draft" | "published" | "archived";
  featured?: boolean;
};

export type ArchiveItemImage = {
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  format: string;
  checksum: string;
  imageUrl: string;
};

export type ArchiveItem = {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  publicContent: string;
  materialType: string;
  rightsStatus: string;
  accessLevel: "public" | "restricted" | "private";
  publicationStatus: "draft" | "published" | "archived";
  altText: string;
  creator?: string;
  dateOrPeriod?: string;
  country?: string;
  region?: string;
  community?: string;
  language?: string;
  subjectTags: string[];
  keywords: string[];
  sourceOrDonor?: string;
  culturalSensitivityLabel?: string;
  caption?: string;
  image: ArchiveItemImage;
  createdAt?: string;
  updatedAt?: string;
};

export type LearningResource = {
  title: string;
  description: string;
  href: string;
};

export type CommunityHighlight = {
  name: string;
  role: string;
  quote: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};
