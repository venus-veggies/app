import { useState } from "react";
import { StarRating } from "./StarRating";

export function InteractionThread({ thread, onUpdate, onDelete, onReply }) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(thread.rating || 0);
  const [editMessage, setEditMessage] = useState(thread.body || "");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");

  const isCustomer = thread.author_type === "customer";
  const canReply = isCustomer && thread.type === "request";

  const saveEdit = async () => {
    await onUpdate(thread.id, {
      body: editMessage,
      rating: editRating || null,
    });
    setEditing(false);
  };

  const postReply = async () => {
    if (!replyBody.trim()) return;
    await onReply(thread.id, replyBody);
    setReplyBody("");
    setReplyOpen(false);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  return (
    <div className="bg-surface rounded-card shadow-card p-4">
      {editing ? (
        <div className="space-y-2">
          {thread.type === "feedback" && (
            <StarRating value={editRating} onChange={setEditRating} />
          )}
          <textarea
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            rows={3}
            className="w-full border border-border rounded-btn px-3 py-2 text-sm outline-none resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={saveEdit}
              className="text-xs text-leaf-700 underline"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-text-subtle underline"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-subtle capitalize">
              {thread.type} · {thread.author_type}
            </div>
            <div className="text-xs text-subtle">
              {formatDate(thread.created_at)}
            </div>
          </div>

          {thread.rating && <StarRating value={thread.rating} size="text-sm" />}

          {thread.body && (
            <p className="text-sm text-body mt-1">{thread.body}</p>
          )}

          {isCustomer && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-leaf-700 underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(thread.id)}
                className="text-xs text-tomato-600 underline"
              >
                Delete
              </button>
              {canReply && (
                <button
                  onClick={() => setReplyOpen(true)}
                  className="text-xs text-leaf-700 underline"
                >
                  Reply
                </button>
              )}
            </div>
          )}

          {(thread.replies || []).map((reply) => (
            <div
              key={reply.id}
              className="ml-5 mt-3 pl-3 border-l-2 border-leaf-100"
            >
              <div className="text-xs text-subtle mb-1">
                {reply.author_type} · {formatDate(reply.created_at)}
              </div>
              <p className="text-sm text-body">{reply.body}</p>
              {reply.author_type === "customer" && (
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => onDelete(reply.id)}
                    className="text-xs text-tomato-600 underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {replyOpen && (
            <div className="ml-5 mt-3">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                rows={2}
                placeholder="Write a reply…"
                className="w-full border border-border rounded-btn px-3 py-2 text-sm outline-none resize-none"
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={postReply}
                  className="text-xs text-leaf-700 underline"
                >
                  Post Reply
                </button>
                <button
                  onClick={() => {
                    setReplyOpen(false);
                    setReplyBody("");
                  }}
                  className="text-xs text-text-subtle underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
