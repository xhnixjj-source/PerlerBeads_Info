import { normalizePatternRow, normalizeSupplierRow } from "@/lib/catalog";
import type { Pattern } from "@/lib/types/pattern";
import type { Supplier } from "@/lib/types/supplier";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function loadAdminSuppliers(): Promise<Supplier[]> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(500);
  if (error) return [];
  return (data ?? []).map((row) => normalizeSupplierRow(row as Record<string, unknown>));
}

export async function loadAdminPatterns(): Promise<Pattern[]> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("patterns")
    .select("*")
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(500);
  if (error) return [];
  return (data ?? []).map((row) => normalizePatternRow(row as Record<string, unknown>));
}

export async function loadAdminOrders(): Promise<Record<string, unknown>[]> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return [];
  return (data ?? []) as Record<string, unknown>[];
}

export async function loadAdminProducts(): Promise<Record<string, unknown>[]> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return [];
  return (data ?? []) as Record<string, unknown>[];
}

export async function loadAdminBlogPosts(): Promise<Record<string, unknown>[]> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return [];
  return (data ?? []) as Record<string, unknown>[];
}

export async function loadAdminInquiries(): Promise<Record<string, unknown>[]> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return [];
  return (data ?? []) as Record<string, unknown>[];
}
