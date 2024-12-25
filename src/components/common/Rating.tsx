import { useState } from "react";

interface RatingProps {
  initialRating?: number;
  onRate: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? "active" : ""}`}
          onClick={() => {
            setRating(star);
            onRate(star);
          }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
