import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { View } from "../App";
import type { ReviewInput } from "../backend.d";
import { backend } from "../backendClient";
import StarRating from "../components/StarRating";
import TierBadge from "../components/TierBadge";

interface BusinessDetailViewProps {
  businessId: string;
  navigate: (view: View) => void;
  isLoggedIn: boolean;
}

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BusinessDetailView({
  businessId,
  navigate,
  isLoggedIn,
}: BusinessDetailViewProps) {
  const queryClient = useQueryClient();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const { data: business, isLoading: businessLoading } = useQuery({
    queryKey: ["business", businessId],
    queryFn: () => backend.getBusinessById(businessId),
    staleTime: 30_000,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", businessId],
    queryFn: () => backend.getReviewsForBusiness(businessId),
    staleTime: 30_000,
  });

  const { data: avgRating = 0 } = useQuery({
    queryKey: ["rating", businessId],
    queryFn: () => backend.getAverageRating(businessId),
    staleTime: 30_000,
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (input: ReviewInput) => {
      await backend.addReview(input);
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setReviewRating(0);
      setReviewComment("");
      queryClient.invalidateQueries({ queryKey: ["reviews", businessId] });
      queryClient.invalidateQueries({ queryKey: ["rating", businessId] });
    },
    onError: () => {
      toast.error("Failed to submit review. Please try again.");
    },
  });

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    const input: ReviewInput = {
      id: crypto.randomUUID(),
      businessId,
      comment: reviewComment.trim(),
      rating: BigInt(reviewRating),
    };

    submitReviewMutation.mutate(input);
  };

  if (businessLoading) {
    return (
      <div className="container mx-auto px-4 max-w-5xl py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto px-4 max-w-5xl py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-3">
          Business not found
        </h2>
        <p className="text-muted-foreground mb-6">
          This business may have been removed or doesn't exist.
        </p>
        <Button onClick={() => navigate({ name: "home" })} className="font-ui">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
      </div>
    );
  }

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(business.address)}&output=embed`;

  return (
    <div className="container mx-auto px-4 max-w-5xl py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate({ name: "home" })}
        data-ocid="business_detail.back_button"
        className="mb-6 -ml-2 font-ui text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Directory
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Header */}
          <div className="bg-card rounded-xl border border-border p-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {business.isFeatured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber/10 text-amber-dark border border-amber/30">
                  <Star className="w-3.5 h-3.5 fill-amber text-amber" />
                  Featured
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-sm font-ui font-medium bg-secondary text-secondary-foreground border border-border">
                {business.category}
              </span>
              <TierBadge tier={business.tier} size="md" />
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              {business.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={avgRating} size="md" showNumber />
              <span className="text-sm text-muted-foreground font-ui">
                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>

            {business.description && (
              <p className="text-muted-foreground font-body leading-relaxed">
                {business.description}
              </p>
            )}
          </div>

          {/* Contact Details */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Contact & Details
            </h2>
            <div className="space-y-3">
              {business.address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-ui mb-0.5">
                      Address
                    </p>
                    <p className="text-sm font-body text-foreground">
                      {business.address}
                    </p>
                  </div>
                </div>
              )}

              {business.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-ui mb-0.5">
                      Phone
                    </p>
                    <a
                      href={`tel:${business.phone}`}
                      className="text-sm font-body text-foreground hover:text-amber transition-colors"
                    >
                      {business.phone}
                    </a>
                  </div>
                </div>
              )}

              {business.email && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-ui mb-0.5">
                      Email
                    </p>
                    <a
                      href={`mailto:${business.email}`}
                      className="text-sm font-body text-foreground hover:text-amber transition-colors"
                    >
                      {business.email}
                    </a>
                  </div>
                </div>
              )}

              {business.website && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-ui mb-0.5">
                      Website
                    </p>
                    <a
                      href={
                        business.website.startsWith("http")
                          ? business.website
                          : `https://${business.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-body text-foreground hover:text-amber transition-colors flex items-center gap-1"
                    >
                      {business.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {business.hours && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-amber" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-ui mb-0.5">
                      Hours
                    </p>
                    <p className="text-sm font-body text-foreground">
                      {business.hours}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-2">
                <StarRating rating={avgRating} size="sm" />
                <span className="font-display font-bold text-lg text-foreground">
                  {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                </span>
              </div>
            </div>

            {/* Add Review Form */}
            {isLoggedIn && (
              <div className="mb-6 p-4 bg-secondary/40 rounded-xl border border-border">
                <h3 className="font-ui font-semibold text-foreground text-sm mb-3">
                  Write a Review
                </h3>

                {/* Star selector */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground font-ui mb-2">
                    Your Rating
                  </p>
                  <div data-ocid="review_form.rating_input">
                    <StarRating
                      rating={reviewRating}
                      size="lg"
                      interactive
                      onRate={setReviewRating}
                    />
                  </div>
                </div>

                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this business..."
                  data-ocid="review_form.comment_input"
                  className="mb-3 font-body text-sm resize-none"
                  rows={3}
                />

                <Button
                  onClick={handleSubmitReview}
                  disabled={submitReviewMutation.isPending}
                  data-ocid="review_form.submit_button"
                  className="font-ui"
                  size="sm"
                >
                  {submitReviewMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-3.5 h-3.5 mr-2" /> Submit
                      Review
                    </>
                  )}
                </Button>
              </div>
            )}

            {!isLoggedIn && (
              <div className="mb-5 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground font-body text-center">
                Sign in to leave a review
              </div>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div
                data-ocid="business_detail.review.empty_state"
                className="text-center py-8 text-muted-foreground"
              >
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-ui">
                  No reviews yet. Be the first to leave one!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div
                    key={review.id}
                    data-ocid={`business_detail.review.item.${idx + 1}`}
                    className="pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-ui font-medium text-foreground">
                            {review.userId.toString().slice(0, 10)}...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={Number(review.rating)} size="sm" />
                    </div>
                    <p className="text-sm font-body text-muted-foreground leading-relaxed pl-9">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Map */}
          {business.address && (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-semibold text-foreground text-sm">
                  Location
                </h3>
              </div>
              <div data-ocid="business_detail.map_marker" className="relative">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="260"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map for ${business.name}`}
                  aria-label={`Map showing location of ${business.name}`}
                />
              </div>
              <div className="p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground font-body flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-amber" />
                  {business.address}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-2">
            <h3 className="font-display font-semibold text-foreground text-sm mb-3">
              Quick Contact
            </h3>
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-ui text-secondary-foreground"
              >
                <Phone className="w-4 h-4 text-amber" />
                Call Now
              </a>
            )}
            {business.email && (
              <a
                href={`mailto:${business.email}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-ui text-secondary-foreground"
              >
                <Mail className="w-4 h-4 text-amber" />
                Send Email
              </a>
            )}
            {business.website && (
              <a
                href={
                  business.website.startsWith("http")
                    ? business.website
                    : `https://${business.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-ui text-secondary-foreground"
              >
                <Globe className="w-4 h-4 text-amber" />
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
