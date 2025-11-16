"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

interface CommentItem {
  id: number;
  author: string;
  content: string;
  date: string;
  like_count: number;
  dislike_count: number;
  parent_id: number;
  replies?: CommentItem[];
}

interface ApiResponse {
  success: boolean;
  comments: CommentItem[];
  pagination: {
    page: number;
    totalPages: number;
  };
  error?: string;
}

const GAME_ID = "steal-brainrot";
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most liked" }
] as const;

export function CommentsSection() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("newest");
  const [error, setError] = useState<string | null>(null);
  const [replyTarget, setreplyTarget] = useState<CommentItem | null>(null);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" });
  const [replyForm, setReplyForm] = useState({ name: "", email: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadComments = useCallback(async (targetPage: number, targetSort: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/comments.ajax?game_id=${GAME_ID}&page=${targetPage}&limit=5&sort=${targetSort}`
      );
      const payload = (await response.json()) as ApiResponse;
      if (!payload.success) {
        throw new Error(payload.error || "Unable to load comments");
      }
      setComments(payload.comments);
      setTotalPages(payload.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load comments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComments(page, sort);
  }, [page, sort, loadComments]);

  const isCommentValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(commentForm.email.trim());
  }, [commentForm.email]);

  const isReplyValid = useMemo(() => {
    if (!replyTarget) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(replyForm.email.trim());
  }, [replyForm.email, replyTarget]);

  const submitComment = useCallback(
    async (formData: { name: string; email: string; content: string }, parentId: number) => {
      const response = await fetch("/api/make-comment.ajax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: formData.name,
          email: formData.email,
          content: formData.content,
          parent_id: parentId,
          game_id: GAME_ID
        })
      });
      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.error || "Unable to submit comment");
      }
      await loadComments(1, sort);
      setPage(1);
    },
    [loadComments, sort]
  );

  const handleSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCommentValid) return;
    try {
      setSubmitting(true);
      await submitComment(commentForm, 0);
      setCommentForm({ name: "", email: "", content: "" });
      setreplyTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!replyTarget || !isReplyValid) return;
    try {
      setSubmitting(true);
      await submitComment(replyForm, replyTarget.id);
      setReplyForm({ name: "", email: "", content: "" });
      setreplyTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (commentId: number, type: "like" | "dislike") => {
    try {
      const response = await fetch("/api/comment-vote.ajax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_id: commentId, vote_type: type })
      });
      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.error || "Unable to record vote");
      }

      const updateCounts = (items: CommentItem[]): CommentItem[] =>
        items.map((item) => {
          if (item.id === commentId) {
            return {
              ...item,
              like_count: payload.counts.like,
              dislike_count: payload.counts.dislike
            };
          }
          if (item.replies?.length) {
            return {
              ...item,
              replies: updateCounts(item.replies)
            };
          }
          return item;
        });

      setComments((prev) => updateCounts(prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to record vote");
    }
  };

  const startReply = (comment: CommentItem) => {
    setreplyTarget(comment);
    setReplyForm({ name: "", email: "", content: "" });
    const section = document.getElementById(`comment-${comment.id}`) ?? document.getElementById("comments-section");
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const cancelReply = () => {
    setreplyTarget(null);
    setReplyForm({ name: "", email: "", content: "" });
  };

  const textareaPlaceholder = "Share your comment...";

  return (
    <section id="comments-section" className="card space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-accent">Comments</h2>
          <p className="text-sm text-white/60">Share your favorite steal tactics or ask for help.</p>
        </div>
        <label className="text-sm text-white/70">
          Sort By
          <select
            className="ml-2 rounded-lg border border-white/10 bg-night px-3 py-2 text-sm"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as typeof sort);
              setPage(1);
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form onSubmit={handleSubmitComment} className="space-y-4 rounded-2xl border border-white/10 bg-surface/60 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Your name"
            value={commentForm.name}
            onChange={(event) => setCommentForm((prev) => ({ ...prev, name: event.target.value }))}
            className="h-12 rounded-lg border border-white/10 bg-night px-4 text-sm focus:border-accent focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={commentForm.email}
            onChange={(event) => setCommentForm((prev) => ({ ...prev, email: event.target.value }))}
            className="h-12 rounded-lg border border-white/10 bg-night px-4 text-sm focus:border-accent focus:outline-none"
            required
          />
        </div>
        <textarea
          placeholder={textareaPlaceholder}
          value={commentForm.content}
          onChange={(event) => setCommentForm((prev) => ({ ...prev, content: event.target.value }))}
          className="min-h-[120px] w-full rounded-lg border border-white/10 bg-night px-4 py-3 text-sm focus:border-accent focus:outline-none"
          required
        />
        <div className="flex flex-wrap items-center justify-end gap-4">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="control-button rounded-full bg-accent px-6 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting || !isCommentValid}
          >
            {submitting ? "Publishing..." : "Publish Comment"}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {loading ? (
          <p className="text-sm text-white/60">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-white/60">No comments yet. Be the first to steal the spotlight!</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} id={`comment-${comment.id}`} className="rounded-2xl border border-white/10 bg-surface/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{comment.author}</p>
                  <p className="text-xs uppercase tracking-widest text-white/50">{comment.date}</p>
                </div>
                <div className="flex gap-2 text-xs text-white/70">
                  <button
                    type="button"
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
                    onClick={() => handleVote(comment.id, "like")}
                  >
                    👍 {comment.like_count}
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
                    onClick={() => handleVote(comment.id, "dislike")}
                  >
                    👎 {comment.dislike_count}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-white/90">{comment.content}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/60">
                <button
                  type="button"
                  className="rounded-full border border-accent/40 bg-accent/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent transition hover:bg-accent/25"
                  onClick={() => startReply(comment)}
                >
                  Reply
                </button>
              </div>
              {replyTarget?.id === comment.id && (
                <form className="mt-4 rounded-xl border border-accent/40 bg-night/30 p-4" onSubmit={handleSubmitReply}>
                  <p className="text-xs uppercase tracking-widest text-accent">Replying to {replyTarget.author}</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={replyForm.name}
                      onChange={(event) => setReplyForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="h-10 rounded-lg border border-white/10 bg-night px-3 text-sm focus:border-accent focus:outline-none"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={replyForm.email}
                      onChange={(event) => setReplyForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="h-10 rounded-lg border border-white/10 bg-night px-3 text-sm focus:border-accent focus:outline-none"
                      required
                    />
                  </div>
                  <textarea
                    placeholder={`Reply to ${replyTarget.author}...`}
                    value={replyForm.content}
                    onChange={(event) => setReplyForm((prev) => ({ ...prev, content: event.target.value }))}
                    className="mt-3 min-h-[80px] w-full rounded-lg border border-white/15 bg-night px-3 py-2 text-sm focus:border-accent focus:outline-none"
                    required
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      className="text-xs uppercase tracking-widest text-white/60 hover:text-white"
                      onClick={cancelReply}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="control-button rounded-full bg-accent px-5 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={submitting || !isReplyValid}
                    >
                      {submitting ? "Publishing..." : "Publish Reply"}
                    </button>
                  </div>
                </form>
              )}
              {comment.replies?.length ? (
                <div className="mt-4 space-y-4 border-l border-white/10 pl-4">
                  {comment.replies.map((reply) => (
                    <article key={reply.id} className="rounded-xl bg-night/40 p-4 text-sm text-white/80">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{reply.author}</p>
                          <p className="text-[10px] uppercase tracking-widest text-white/50">{reply.date}</p>
                        </div>
                        <div className="flex gap-2 text-[10px] text-white/70">
                          <button
                            type="button"
                            className="rounded-xl border border-white/15 px-3 py-1 text-xs font-semibold text-white transition hover:border-white/40"
                            onClick={() => handleVote(reply.id, "like")}
                          >
                            👍 {reply.like_count}
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-white/15 px-3 py-1 text-xs font-semibold text-white transition hover:border-white/40"
                            onClick={() => handleVote(reply.id, "dislike")}
                          >
                            👎 {reply.dislike_count}
                          </button>
                        </div>
                      </div>
                      <p className="mt-2">{reply.content}</p>
                    </article>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          className="control-button disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={loading || page === 1}
        >
          Previous
        </button>
        <p className="text-sm text-white/60">
          Page {page} of {totalPages}
        </p>
        <button
          type="button"
          className="control-button disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={loading || page === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}
