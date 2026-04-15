export type Supplier = {
  id: string;
  slug: string;
  company_name: string;
  description: string;
  location: string;
  factory_type: string;
  moq: string;
  lead_time: string;
  accepted_payment: string[];
  is_verified: boolean;
  contact_email?: string | null;
  website?: string | null;
  main_products: string[];
  certification_badges: string[];
  gallery_urls?: string[];
};
