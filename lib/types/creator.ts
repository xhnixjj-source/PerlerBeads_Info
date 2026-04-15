export type Creator = {
  id: string;
  slug: string;
  name: string;
  bio: string;
  platform: string;
  profile_url?: string | null;
  avatar_url?: string | null;
  featured_works?: string[];
  is_featured: boolean;
};
