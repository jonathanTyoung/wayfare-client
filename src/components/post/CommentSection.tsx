import { useState, useRef, useEffect } from "react";
import { MessageCircle, Trash2, CornerDownRight } from "lucide-react";
import { createComment, deleteComment } from "../data/CommentData";

interface CommentTraveler {
  id: number;
  username: string;
}

interface Reply {
  id: number;
  traveler: CommentTraveler;
  content: string;
  created_at: string;
}

interface Comment {
  id: number;
  traveler: CommentTraveler;
  content: string;
  created_at: string;
  replies: Reply[];
}

interface Props {
  postId: number;
  initialComments: Comment[];
  currentUser: { id: number; username: string } | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CommentSection({ postId, initialComments, currentUser }: Props) {
  const [comments, setComments] = useState<Comment[]>(
    (initialComments || []).map((c) => ({ ...c, replies: c.replies || [] }))
  );
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: number; username: string } | null>(null);
  const [replyInput, setReplyInput] = useState("");
  const replyInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("wayfare_token");

  // Focus the reply input whenever it opens
  useEffect(() => {
    if (replyingTo) replyInputRef.current?.focus();
  }, [replyingTo]);

  const totalCount = comments.reduce(
    (sum, c) => sum + 1 + (c.replies?.length ?? 0),
    0
  );

  // ── Post top-level comment ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || !token || !currentUser) return;

    const tempId = -Date.now();
    const optimistic: Comment = {
      id: tempId,
      traveler: { id: -1, username: currentUser.username },
      content,
      created_at: new Date().toISOString(),
      replies: [],
    };

    setComments((prev) => [optimistic, ...prev]);
    setInput("");
    setSubmitting(true);

    try {
      const saved = await createComment(postId, content, token);
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? { ...saved, replies: [] } : c))
      );
    } catch {
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setInput(content);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Post reply ──────────────────────────────────────────────────────────
  const handleReplySubmit = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    const content = replyInput.trim();
    if (!content || !token || !currentUser) return;

    const tempId = -Date.now();
    const optimistic: Reply = {
      id: tempId,
      traveler: { id: -1, username: currentUser.username },
      content,
      created_at: new Date().toISOString(),
    };

    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId ? { ...c, replies: [...c.replies, optimistic] } : c
      )
    );
    setReplyingTo(null);
    setReplyInput("");

    try {
      const saved = await createComment(postId, content, token, parentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: c.replies.map((r) => (r.id === tempId ? saved : r)) }
            : c
        )
      );
    } catch {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: c.replies.filter((r) => r.id !== tempId) }
            : c
        )
      );
      alert("Failed to post reply. Please try again.");
    }
  };

  // ── Delete comment or reply ─────────────────────────────────────────────
  const handleDelete = async (commentId: number, parentId?: number) => {
    if (!token) return;

    // Optimistic remove
    if (parentId != null) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: c.replies.filter((r) => r.id !== commentId) }
            : c
        )
      );
    } else {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }

    try {
      await deleteComment(commentId, token);
    } catch {
      alert("Failed to delete. Please refresh and try again.");
    }
  };

  return (
    <section className="mt-12 bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700/30 shadow-2xl px-8 py-12 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <MessageCircle className="w-6 h-6 text-app-accent" />
        <h3 className="text-2xl font-bold text-white">Comments</h3>
        <span className="bg-stone-700/50 text-app-accent text-sm px-3 py-1 rounded-full ml-auto">
          {totalCount}
        </span>
      </div>

      {/* Input */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="mb-10 flex gap-3 items-start">
          <div className="w-9 h-9 bg-app-accent rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a comment…"
              maxLength={1000}
              className="flex-1 bg-stone-900/60 border border-stone-700/50 rounded-lg px-4 py-2.5 text-sm text-stone-200 placeholder-stone-500 focus:border-app-accent/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || submitting}
              className="bg-app-accent hover:bg-app-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              {/* Comment */}
              <div className="group bg-gradient-to-r from-stone-900/80 to-stone-800/60 border border-stone-700/40 p-5 rounded-xl hover:border-app-accent/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-app-accent rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {comment.traveler.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-app-accent font-semibold text-sm">
                        {comment.traveler.username}
                      </span>
                      <span className="text-stone-500 text-xs">
                        {formatDate(comment.created_at)}
                      </span>
                      {/* Actions — visible on hover */}
                      <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentUser && (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo({ id: comment.id, username: comment.traveler.username });
                              setReplyInput(`@${comment.traveler.username} `);
                            }}
                            className="text-stone-400 hover:text-app-accent text-xs px-2 py-1 rounded transition-colors bg-transparent"
                          >
                            Reply
                          </button>
                        )}
                        {currentUser?.username === comment.traveler.username && (
                          <button
                            type="button"
                            onClick={() => handleDelete(comment.id)}
                            className="text-stone-500 hover:text-red-400 transition-colors bg-transparent p-1"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-stone-200 leading-relaxed text-sm">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-12 mt-1 space-y-1">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="group flex items-start gap-3 bg-stone-900/40 border border-stone-700/20 rounded-lg px-4 py-3"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 text-stone-600 mt-0.5 shrink-0" />
                      <div className="w-7 h-7 bg-gradient-to-br from-teal to-teal-hover rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {reply.traveler.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-teal font-semibold text-xs">
                            {reply.traveler.username}
                          </span>
                          <span className="text-stone-500 text-xs">
                            {formatDate(reply.created_at)}
                          </span>
                          {currentUser?.username === reply.traveler.username && (
                            <button
                              type="button"
                              onClick={() => handleDelete(reply.id, comment.id)}
                              className="ml-auto opacity-0 group-hover:opacity-100 text-stone-500 hover:text-red-400 transition-all bg-transparent p-0.5"
                              title="Delete reply"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-stone-300 text-xs leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline reply form */}
              {replyingTo?.id === comment.id && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, comment.id)}
                  className="ml-12 mt-2 flex gap-2"
                >
                  <input
                    ref={replyInputRef}
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder={`Reply to @${replyingTo.username}…`}
                    maxLength={1000}
                    className="flex-1 bg-stone-900/60 border border-teal/40 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:border-teal/50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!replyInput.trim()}
                    className="bg-teal hover:bg-teal-hover disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => { setReplyingTo(null); setReplyInput(""); }}
                    className="text-stone-500 hover:text-stone-300 text-xs px-2 py-2 bg-transparent transition-colors"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-stone-700/50 rounded-xl bg-stone-900/30">
          <div className="w-16 h-16 bg-stone-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-stone-500" />
          </div>
          <h4 className="text-white text-xl font-semibold mb-3">No comments yet</h4>
          <p className="text-stone-400 text-base max-w-md mx-auto leading-relaxed">
            Be the first to share your thoughts about this story.
          </p>
        </div>
      )}
    </section>
  );
}
