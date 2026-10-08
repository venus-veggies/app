import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { FeedbackForm } from "./FeedbackForm";
import { InteractionThread } from "./InteractionThread";

export function FeedbackSection({ orderId, orderStatus }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${orderId}/interactions`);
      // Only show feedback here — requests are shown elsewhere as read-only
      const onlyFeedback = (data.data || []).filter(
        (t) => t.type === "feedback",
      );
      setThreads(onlyFeedback);
    } catch {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchInteractions();
  }, [orderId]);

  const hasFeedback = threads.some((t) => t.parent_id === null);
  const canFeedback = orderStatus === "delivered" && !hasFeedback;

  const submitFeedback = async (payload) => {
    try {
      await api.post(`/orders/${orderId}/interactions`, payload);
      setShowForm(false);
      fetchInteractions();
      toast.success("Feedback submitted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
      throw err;
    }
  };

  const submitReply = async (parentId, body) => {
    try {
      await api.post(`/orders/${orderId}/interactions/${parentId}/reply`, {
        body,
      });
      fetchInteractions();
      toast.success("Reply added.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add reply");
    }
  };

  const updateInteraction = async (id, data) => {
    try {
      await api.put(`/orders/${orderId}/interactions/${id}`, data);
      fetchInteractions();
      toast.success("Updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const deleteInteraction = async (id) => {
    try {
      await api.delete(`/orders/${orderId}/interactions/${id}`);
      fetchInteractions();
      toast.success("Deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) {
    return <div className="py-4 text-center text-sm text-muted">Loading…</div>;
  }

  return (
    <div className="space-y-4">
      {canFeedback && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm text-leaf-700 underline underline-offset-2"
        >
          Rate this order
        </button>
      )}

      {showForm && <FeedbackForm onSubmit={submitFeedback} />}

      {threads.length === 0 && !showForm && (
        <p className="text-sm text-muted">No feedback yet.</p>
      )}

      {threads.map((thread) => (
        <InteractionThread
          key={thread.id}
          thread={thread}
          onUpdate={updateInteraction}
          onDelete={deleteInteraction}
          onReply={submitReply}
        />
      ))}
    </div>
  );
}
