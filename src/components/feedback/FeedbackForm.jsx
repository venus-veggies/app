import { useState } from "react";
import toast from "react-hot-toast";
import { StarRating } from "./StarRating";

export function FeedbackForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) {
      toast.error("Please select a rating.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a message.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ type: "feedback", body: message, rating });
      setRating(0);
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface rounded-card shadow-card p-4">
      <div className="mb-2">
        <StarRating value={rating} onChange={setRating} />
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="How was your order?"
        className="w-full border border-border rounded-btn px-3 py-2 text-sm outline-none placeholder:text-muted resize-none mb-2"
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-2.5 rounded-btn bg-leaf-500 text-white text-sm font-medium disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit Feedback"}
      </button>
    </div>
  );
}
