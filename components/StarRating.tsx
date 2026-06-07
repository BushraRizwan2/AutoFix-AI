
import React, { useState } from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  onSubmit: (rating: number, review: string) => void;
  isSubmitted: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ onSubmit, isSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, review);
    } else {
      alert("Please select a rating.");
    }
  };

  if (isSubmitted) {
      return (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Thank You!</h3>
            <p className="text-slate-600 dark:text-slate-400">Your review has been submitted.</p>
        </div>
      )
  }

  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 text-center">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Rate Your Service</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">Share your experience to help others.</p>
      
      <div className="flex justify-center items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-10 w-10 cursor-pointer transition-all duration-200 ${
              (hoverRating || rating) >= star ? 'text-amber-400 scale-110' : 'text-slate-300 dark:text-slate-700'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Tell us more about your experience (optional)..."
        className="w-full p-3 h-24 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition mb-4 text-slate-900 dark:text-white"
      ></textarea>

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-600 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        Submit Review
      </button>
    </div>
  );
};
