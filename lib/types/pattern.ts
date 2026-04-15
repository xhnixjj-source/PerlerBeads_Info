export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ColorRequirement = {
  color_name: string;
  hex: string;
  count: number;
};

export type Pattern = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  difficulty: Difficulty;
  peg_width: number;
  peg_height: number;
  bead_count: number;
  colors_required: ColorRequirement[];
  tags: string[];
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string;
};
