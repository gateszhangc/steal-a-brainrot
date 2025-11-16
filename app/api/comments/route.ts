import { HOMEPAGE_GAME_ID } from "@/lib/comments/constants";
import { createComment, fetchComments } from "@/lib/comments/service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit")) || 5));
  const cursor = searchParams.get("cursor");
  const gameIdParam = searchParams.get("gameId") ?? HOMEPAGE_GAME_ID;

  if (gameIdParam !== HOMEPAGE_GAME_ID) {
    return Response.json({ error: "Invalid game" }, { status: 400 });
  }

  try {
    const payload = await fetchComments(limit, cursor);
    return Response.json(payload, { status: 200 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const name = String(body.name ?? body.author ?? "").trim();
  const email = String(body.email ?? "").trim();
  const commentBody = String(body.body ?? body.content ?? "").trim();
  const gameId = String(body.gameId ?? HOMEPAGE_GAME_ID);

  if (gameId !== HOMEPAGE_GAME_ID) {
    return Response.json({ error: "Invalid game" }, { status: 400 });
  }

  if (name.length < 2 || name.length > 50) {
    return Response.json({ error: "昵称需要在 2-50 个字符之间" }, { status: 422 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return Response.json({ error: "请输入有效邮箱" }, { status: 422 });
  }
  if (commentBody.length < 6 || commentBody.length > 500) {
    return Response.json({ error: "评论长度需在 6-500 字之间" }, { status: 422 });
  }

  try {
    const created = await createComment({ name, email, body: commentBody });
    return Response.json({ data: created }, { status: 201 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
