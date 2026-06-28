import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useGetCourseQuery, useAddReviewMutation } from "@/redux/features/courseApiSlice";
import Button from "@/app/components/ui/Button";

interface CourseReviewsProps {
  courseId: string;
  hideForm?: boolean;
  hideList?: boolean;
}

const CourseReviews: FC<CourseReviewsProps> = ({ courseId, hideForm, hideList }) => {
  const { data } = useGetCourseQuery(courseId);
  const [addReview, { isLoading }] = useAddReviewMutation();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const { user } = useSelector((state: any) => state.auth);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (review.trim() === "") {
      setError("Please write a review.");
      return;
    }

    try {
      await addReview({ id: courseId, body: { rating, review } }).unwrap();
      setRating(0);
      setReview("");
      setError("");
    } catch (err: any) {
      setError(err.data?.message || "Failed to submit review.");
    }
  };

  const reviews = data?.course?.reviews || [];
  const hasReviewed = reviews.some((r: any) => r.user?._id === user?._id);

  return (
    <div className="mt-12 border-t border-border pt-10">
      {!hideForm && !hideList ? (
        <h2 className="text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] mb-6">Course Reviews</h2>
      ) : !hideList ? (
        <h2 className="text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] mb-6">Course Reviews</h2>
      ) : null}
      
      {!hideForm && !hasReviewed && (
        <div className="mb-8 p-6 border border-border rounded-[12px] bg-card/50">
          <h3 className="text-[15px] font-medium text-foreground mb-4">Leave a Review</h3>
        <div className="flex gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-2xl transition-colors ${star <= rating ? "text-yellow-500" : "text-muted hover:text-muted-foreground"}`}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="w-full p-4 border border-border rounded-[10px] bg-background text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-4"
          rows={4}
          placeholder="What did you think of this course?"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
      )}

      {!hideList && (
      <div className="space-y-4">
        {reviews.map((r, index) => (
          <div key={index} className="p-5 border border-border rounded-[12px] bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {r.user?.avatar?.url ? (
                  <img src={r.user.avatar.url} alt={r.user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">{r.user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="font-medium text-[15px] text-foreground">{r.user?.name}</p>
                <div className="flex text-yellow-500 text-sm mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < r.rating ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-[15px] leading-relaxed pl-[52px]">{r.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted text-[15px]">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default CourseReviews;
