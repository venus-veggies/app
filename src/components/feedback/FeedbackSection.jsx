import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";

export function FeedbackSection({ orderId, orderStatus }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRootForm, setShowRootForm] = useState(false);
  const [rootRating, setRootRating] = useState(0);
  const [rootMessage, setRootMessage] = useState("");

  const [replyStates, setReplyStates] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editMessage, setEditMessage] = useState("");

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${orderId}/feedback`);
      setThreads(data.data || []);
    } catch {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchFeedback();
  }, [orderId]);

  const hasRootFeedback = threads.some((t) => t.parent_id === null);
  const canFeedback = orderStatus === "delivered" && !hasRootFeedback;

  const submitRootFeedback = async () => {
    if (rootRating < 1) {
      toast.error("Please select a rating.");
      return;
    }
    try {
      await api.post(`/orders/${orderId}/feedback`, {
        rating: rootRating,
        message: rootMessage,
      });
      setShowRootForm(false);
      setRootRating(0);
      setRootMessage("");
      fetchFeedback();
      toast.success("Feedback submitted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  const submitReply = async (parentId) => {
    const state = replyStates[parentId];
    if (!state?.message?.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }

    try {
      await api.post(`/orders/${orderId}/feedback`, {
        parent_id: parentId,
        message: state.message,
      });
      setReplyStates((prev) => ({
        ...prev,
        [parentId]: { show: false, message: "" },
      }));
      fetchFeedback();
      toast.success("Reply added.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add reply");
    }
  };

  const updateFeedback = async () => {
    try {
      await api.put(`/feedback/${editingId}`, {
        rating: editRating,
        message: editMessage,
      });
      setEditingId(null);
      fetchFeedback();
      toast.success("Feedback updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update feedback");
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await api.delete(`/feedback/${id}`);
      fetchFeedback();
      toast.success("Feedback deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete feedback");
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center text-sm text-muted">
        Loading feedback…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canFeedback && !showRootForm && (
        <button
          onClick={() => setShowRootForm(true)}
          className="text-sm text-leaf-700 underline underline-offset-2"
        >
          Rate this order
        </button>
      )}

      {showRootForm && (
        <div className="bg-surface rounded-card shadow-card p-4">
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRootRating(star)}
                className={`text-2xl ${star <= rootRating ? "text-gold-500" : "text-subtle"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={rootMessage}
            onChange={(e) => setRootMessage(e.target.value)}
            rows={3}
            placeholder="Share your experience (optional)"
            className="w-full border border-border rounded-btn px-3 py-2 text-sm outline-none placeholder:text-muted resize-none mb-2"
          />
          <button
            onClick={submitRootFeedback}
            className="w-full py-2.5 rounded-btn bg-leaf-500 text-white text-sm font-medium"
          >
            Submit Feedback
          </button>
        </div>
      )}

      {threads.length === 0 && !showRootForm && (
        <p className="text-sm text-muted">No feedback yet.</p>
      )}

      {threads.map((thread) => (
        <div
          key={thread.id}
          className="bg-surface rounded-card shadow-card p-4"
        >
          {editingId === thread.id ? (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setEditRating(star)}
                    className={`text-2xl ${star <= editRating ? "text-gold-500" : "text-subtle"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                rows={3}
                className="w-full border border-border rounded-btn px-3 py-2 text-sm outline-none placeholder:text-muted resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={updateFeedback}
                  className="text-xs text-leaf-700 underline"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-xs text-text-subtle underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-gold-500 text-sm">
                  {"★".repeat(thread.rating || 0)}
                  <span className="text-subtle">
                    {"★".repeat(5 - (thread.rating || 0))}
                  </span>
                </div>
                <div className="text-xs text-subtle">
                  {new Date(thread.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
              {thread.message && (
                <p className="text-sm text-body mt-1">{thread.message}</p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setEditingId(thread.id)}
                  className="text-xs text-leaf-700 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFeedback(thread.id)}
                  className="text-xs text-tomato-600 underline"
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    setReplyStates((prev) => ({
                      ...prev,
                      [thread.id]: { ...prev[thread.id], show: true },
                    }))
                  }
                  className="text-xs text-leaf-700 underline"
                >
                  Reply
                </button>
              </div>

              {(thread.replies || []).map((reply) => (
                <div
                  key={reply.id}
                  className="ml-5 mt-3 pl-3 border-l-2 border-leaf-100"
                >
                  <div className="text-xs text-subtle">
                    {new Date(reply.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  <p className="text-sm text-body mt-1">{reply.message}</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => deleteFeedback(reply.id)}
                      className="text-xs text-tomato-600 underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {replyStates[thread.id]?.show && (
                <div className="ml-5 mt-3">
                  <textarea
                    value={replyStates[thread.id]?.message || ""}
                    onChange={(e) =>
                      setReplyStates((prev) => ({
                        ...prev,
                        [thread.id]: {
                          ...prev[thread.id],
                          message: e.target.value,
                        },
                      }))
                    }
                    rows={2}
                    placeholder="Write a reply…"
                    className="w-full border border-border rounded-btn px-3 py-2 text-sm outline-none placeholder:text-muted resize-none"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => submitReply(thread.id)}
                      className="text-xs text-leaf-700 underline"
                    >
                      Post Reply
                    </button>
                    <button
                      onClick={() =>
                        setReplyStates((prev) => ({
                          ...prev,
                          [thread.id]: { show: false },
                        }))
                      }
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
      ))}
    </div>
  );
}
