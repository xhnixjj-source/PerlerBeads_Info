/** Rich text document (TipTap / ProseMirror compatible). */
export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: Record<string, unknown>;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};

export type PatternMetadata = {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  colors_required: { color_name: string; hex: string; count: number }[];
  estimated_bead_count: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};
