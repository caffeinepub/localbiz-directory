import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Clock, MapPin, Phone } from "lucide-react";
import type { View } from "../App";
import type { Business } from "../backend.d";
import { backend } from "../backendClient";
import StatusBadge from "../components/StatusBadge";
import TierBadge from "../components/TierBadge";

interface MyListingsViewProps {
  navigate: (view: View) => void;
  isLoggedIn: boolean;
}

export default function MyListingsView({
  navigate,
  isLoggedIn,
}: MyListingsViewProps) {
  const { data: myBusinesses = [], isLoading } = useQuery({
    queryKey: ["myBusinesses"],
    queryFn: () => backend.getMyBusinesses(),
    enabled: isLoggedIn,
    staleTime: 30_000,
  });

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary flex items-center justify-center">
          <Building2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">
          Sign in to View Listings
        </h2>
        <p className="text-muted-foreground font-body mb-6">
          Sign in to see your submitted business listings.
        </p>
        <Button
          onClick={() => navigate({ name: "home" })}
          variant="outline"
          className="font-ui"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ name: "home" })}
        className="mb-6 -ml-2 font-ui text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Directory
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            My Listings
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Manage and track your submitted business listings
          </p>
        </div>
        <Button
          onClick={() => navigate({ name: "register" })}
          className="font-ui bg-primary text-primary-foreground hidden sm:flex"
          size="sm"
        >
          + Register Business
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-5 animate-pulse"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-5 bg-muted rounded-full w-20" />
              </div>
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : myBusinesses.length === 0 ? (
        <div
          data-ocid="my_listings.empty_state"
          className="text-center py-16 bg-card rounded-xl border border-border border-dashed"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No listings yet
          </h3>
          <p className="text-muted-foreground text-sm font-body max-w-sm mx-auto mb-5">
            You haven't registered any businesses. Add your first listing to get
            started.
          </p>
          <Button
            onClick={() => navigate({ name: "register" })}
            className="font-ui bg-primary text-primary-foreground"
            size="sm"
          >
            Register Your First Business
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {myBusinesses.map((business: Business, idx) => (
            <div
              key={business.id}
              data-ocid={`my_listings.item.${idx + 1}`}
              className="bg-card rounded-xl border border-border p-5 hover:border-amber/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* Name & Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-display font-semibold text-foreground text-base">
                      {business.name}
                    </h3>
                    <StatusBadge status={business.status} />
                    <TierBadge tier={business.tier} />
                    {business.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-ui font-medium bg-amber/10 text-amber-dark border border-amber/30">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <p className="text-xs text-muted-foreground font-ui mb-2">
                    {business.category}
                  </p>

                  {business.description && (
                    <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-3">
                      {business.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="flex flex-wrap gap-3">
                    {business.address && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 text-amber" />
                        {business.address}
                      </span>
                    )}
                    {business.phone && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3 text-amber" />
                        {business.phone}
                      </span>
                    )}
                    {business.hours && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 text-amber" />
                        {business.hours}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0">
                  {business.status === "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate({
                          name: "business-detail",
                          businessId: business.id,
                        })
                      }
                      className="font-ui text-xs"
                    >
                      View Listing
                    </Button>
                  )}
                </div>
              </div>

              {/* Status info */}
              {business.status === "pending" && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground font-body">
                    ⏳ Your business is awaiting admin review. This typically
                    takes 24-48 hours.
                  </p>
                </div>
              )}
              {business.status === "rejected" && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground font-body">
                    ❌ This listing was not approved. Please contact support for
                    more information.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
