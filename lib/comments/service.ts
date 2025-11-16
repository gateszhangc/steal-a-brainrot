import { createClient } from "@supabase/supabase-js";
import { HOMEPAGE_GAME_ID } from "./constants";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let cachedClient: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return cachedClient;
}

interface CommentRow {
  id: string;
  game_id: string;
  author: string;
  email: string;
  body: string;
  created_at: string;
}

export interface PublicComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

const mapRow = (row: CommentRow): PublicComment => ({
  id: row.id,
  author: row.author,
  body: row.body,
  createdAt: row.created_at
});

export async function fetchComments(limit: number, cursor?: string | null) {
  let query = getSupabase()
    .from<CommentRow>("comments")
    .select("*")
    .eq("game_id", HOMEPAGE_GAME_ID)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const sanitized = (data ?? []).map(mapRow);
  const nextCursor = sanitized.length === limit ? sanitized[sanitized.length - 1].createdAt : null;

  return { data: sanitized, nextCursor };
}

export async function createComment(input: { name: string; email: string; body: string }) {
  const payload = {
    author: input.name.trim(),
    email: input.email.trim(),
    body: input.body.trim(),
    game_id: HOMEPAGE_GAME_ID
  };

  const { data, error } = await getSupabase()
    .from<CommentRow>("comments")
    .insert(payload)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to save comment");
  }

  return mapRow(data);
}
