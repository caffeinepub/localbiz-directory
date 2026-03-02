import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showNumber = false,
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const starSize = { sm: 14, md: 18, lg: 24 };
  const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= Math.round(rating);
          const partial =
            !filled && starValue - 1 < rating && rating < starValue;
          const gradId = `partial-${i}-${Math.round(rating * 10)}`;

          const svgContent = (
            <svg
              width={starSize[size]}
              height={starSize[size]}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {partial && (
                <defs>
                  <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
                    <stop
                      offset={`${(rating - Math.floor(rating)) * 100}%`}
                      stopColor="oklch(0.72 0.16 65)"
                    />
                    <stop
                      offset={`${(rating - Math.floor(rating)) * 100}%`}
                      stopColor="oklch(0.88 0.01 80)"
                    />
                  </linearGradient>
                </defs>
              )}
              <path
                d={STAR_PATH}
                fill={
                  partial
                    ? `url(#${gradId})`
                    : filled
                      ? "oklch(0.72 0.16 65)"
                      : "oklch(0.88 0.01 80)"
                }
                stroke={
                  filled || partial
                    ? "oklch(0.65 0.18 60)"
                    : "oklch(0.82 0.02 80)"
                }
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );

          if (interactive) {
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => onRate?.(starValue)}
                className="transition-transform hover:scale-110 cursor-pointer"
                aria-label={`Rate ${starValue} star${starValue !== 1 ? "s" : ""}`}
              >
                {svgContent}
              </button>
            );
          }

          return (
            <span key={starValue} className="cursor-default" aria-hidden="true">
              {svgContent}
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span
          className={cn("font-ui font-medium text-foreground", textSize[size])}
        >
          {rating > 0 ? rating.toFixed(1) : "No ratings"}
        </span>
      )}
    </div>
  );
}
