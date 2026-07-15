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
