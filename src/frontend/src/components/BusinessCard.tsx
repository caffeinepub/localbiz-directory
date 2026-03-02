import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import type { View } from "../App";
import type { Business } from "../backend.d";
import { backend } from "../backendClient";
import StarRating from "./StarRating";
import TierBadge from "./TierBadge";

interface BusinessCardProps {
  business: Business;
  navigate: (view: View) => void;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Restaurants: "bg-orange-50 text-orange-700 border border-orange-200",
  Shops: "bg-blue-50 text-blue-700 border border-blue-200",
  Services: "bg-purple-50 text-purple-700 border border-purple-200",
  Health: "bg-green-50 text-green-700 border border-green-200",
  Professionals: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Others: "bg-gray-50 text-gray-700 border border-gray-200",
};

export default function BusinessCard({
  business,
  navigate,
  index,
}: BusinessCardProps) {
  const { data: avgRating = 0 } = useQuery({
    queryKey: ["rating", business.id],
    queryFn: () => backend.getAverageRating(business.id),
    staleTime: 60_000,
  });

  const categoryClass =
    CATEGORY_COLORS[business.category] ??
    "bg-gray-50 text-gray-700 border border-gray-200";

  return (
    <button
      type="button"
      data-ocid={`home.business.item.${index}`}
      onClick={() =>
        navigate({ name: "business-detail", businessId: business.id })
      }
      className={cn(
        "w-full text-left bg-card rounded-xl border border-border p-5",
        "card-hover shadow-card group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        business.isFeatured && "ring-2 ring-amber/40 border-amber/50",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {business.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber/10 text-amber-dark border border-amber/30">
                <Star className="w-3 h-3 fill-amber text-amber" />
                Featured
              </span>
            )}
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-ui font-medium",
                categoryClass,
              )}
            >
              {business.category}
            </span>
          </div>
          <h3 className="font-display font-semibold text-foreground text-base leading-snug group-hover:text-amber transition-colors truncate">
            {business.name}
          </h3>
        </div>
        <TierBadge tier={business.tier} />
      </div>

      {/* Description */}
      {business.description && (
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3 font-body leading-relaxed">
          {business.description}
        </p>
      )}

      {/* Details */}
      <div className="space-y-1.5 mb-3">
        {business.address && (
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber" />
            <span className="truncate">{business.address}</span>
          </div>
        )}
        {business.phone && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="w-3.5 h-3.5 shrink-0 text-amber" />
            <span>{business.phone}</span>
          </div>
        )}
        {business.hours && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 shrink-0 text-amber" />
            <span className="truncate">{business.hours}</span>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <StarRating rating={avgRating} size="sm" showNumber />
        <span className="text-xs text-muted-foreground font-ui group-hover:text-amber transition-colors">
          View Details →
        </span>
      </div>
    </button>
  );
}
