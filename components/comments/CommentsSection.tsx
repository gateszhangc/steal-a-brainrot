"use client";

import { useCallback, useEffect, useState } from "react";

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
];

export function CommentsSection() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("newest");
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<CommentItem | null>(null);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
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

  const validateForm = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.name.trim().length < 2) {
      return "Please share a name or nickname.";
    }
    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email so we can follow up.";
    }
    if (form.content.trim().length < 3) {
      return "Your comment needs a little more detail.";
    }
    return null;
  }, [form]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const response = await fetch("/api/make-comment.ajax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: form.name,
          email: form.email,
          content: form.content,
          parent_id: replyingTo?.id ?? 0,
          game_id: GAME_ID
        })
      });
      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.error || "Unable to submit comment");
      }
      setForm({ name: "", email: "", content: "" });
      setReplyingTo(null);
      setPage(1);
      await loadComments(1, sort);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit comment");
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
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                like_count: payload.counts.like,
                dislike_count: payload.counts.dislike
              }
            : comment
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to record vote");
    }
  };

  const startReply = (comment: CommentItem) => {
    setReplyingTo(comment);
    const section = document.getElementById("comments-section");
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="comments-section" className="card space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-accent">?? Comments</h2>
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

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-surface/60 p-6">
        {replyingTo && (
          <div className="flex items-center justify-between rounded-lg border border-accent/50 bg-accent/10 px-4 py-2 text-sm text-accent">
            Replying to {replyingTo.author}
            <button type="button" onClick={() => setReplyingTo(null)} className="text-xs uppercase tracking-widest">
              Cancel
            </button>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="h-12 rounded-lg border border-white/10 bg-night px-4 text-sm focus:border-accent focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="h-12 rounded-lg border border-white/10 bg-night px-4 text-sm focus:border-accent focus:outline-none"
            required
          />
        </div>
        <textarea
          placeholder="Share what you love about Steal A Brainrot..."
          value={form.content}
          onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
          className="min-h-[120px] rounded-lg border border-white/10 bg-night px-4 py-3 text-sm focus:border-accent focus:outline-none"
          required
        />
        <div className="flex flex-wrap items-center gap-4">
          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
          <button
            type="submit"
            className="control-button disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Publish Comment"}
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
            <article key={comment.id} className="rounded-2xl border border-white/10 bg-surface/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{comment.author}</p>
                  <p className="text-xs uppercase tracking-widest text-white/50">{comment.date}</p>
                </div>
                <div className="flex gap-2 text-xs text-white/70">
                  <button
                    type="button"
                    className="control-button min-w-[90px] justify-center bg-white/10"
                    onClick={() => handleVote(comment.id, "like")}
                  >
                    ?? {comment.like_count}
                  </button>
                  <button
                    type="button"
                    className="control-button min-w-[90px] justify-center bg-white/10"
                    onClick={() => handleVote(comment.id, "dislike")}
                  >
                    ?? {comment.dislike_count}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-white/90">{comment.content}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/60">
                <button type="button" className="control-button bg-white/10 px-3" onClick={() => startReply(comment)}>
                  Reply
                </button>
              </div>
              {comment.replies?.length ? (
                <div className="mt-4 space-y-3 border-l border-white/10 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="rounded-xl border border-white/5 bg-black/30 p-3">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span className="font-semibold text-white">{reply.author}</span>
                        <span>{reply.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-white/80">{reply.content}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-white/70">
        <button
          type="button"
          className="control-button disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="control-button disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}
