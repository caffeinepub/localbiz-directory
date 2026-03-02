import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Building2,
  Heart,
  Loader2,
  MapPin,
  MoreHorizontal,
  Search,
  ShoppingBag,
  Star,
  Utensils,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { View } from "../App";
import type { Business } from "../backend.d";
import { backend } from "../backendClient";
import BusinessCard from "../components/BusinessCard";

interface HomeViewProps {
  navigate: (view: View) => void;
}

const CATEGORIES = [
  { label: "All", value: null, icon: Building2 },
  { label: "Restaurants", value: "Restaurants", icon: Utensils },
  { label: "Shops", value: "Shops", icon: ShoppingBag },
  { label: "Services", value: "Services", icon: Wrench },
  { label: "Health", value: "Health", icon: Heart },
  { label: "Professionals", value: "Professionals", icon: Briefcase },
  { label: "Others", value: "Others", icon: MoreHorizontal },
];

export default function HomeView({ navigate }: HomeViewProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<Business[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Load approved businesses
  const { data: approvedBusinesses = [], isLoading } = useQuery({
    queryKey: ["approvedBusinesses"],
    queryFn: () => backend.getApprovedBusinesses(),
    staleTime: 30_000,
  });

  // Load featured businesses
  const { data: featuredBusinesses = [] } = useQuery({
    queryKey: ["featuredBusinesses"],
    queryFn: () => backend.getFeaturedBusinesses(),
    staleTime: 30_000,
  });

  const displayedBusinesses = useMemo(() => {
    let businesses =
      hasSearched && searchResults !== null
        ? searchResults
        : approvedBusinesses;

    if (activeCategory !== null) {
      businesses = businesses.filter((b) => b.category === activeCategory);
    }

    return businesses;
  }, [hasSearched, searchResults, approvedBusinesses, activeCategory]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await backend.searchBusinesses(
        searchKeyword.trim() || null,
        null,
      );
      setSearchResults(results.filter((b) => b.status === "approved"));
      setHasSearched(true);
    } catch {
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchResults(null);
    setHasSearched(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-pattern text-white relative overflow-hidden">
        {/* Decorative amber accent */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-amber/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber/30 bg-amber/10 text-amber text-sm font-ui font-medium mb-6">
              <MapPin className="w-3.5 h-3.5" />
              Discover Local Businesses
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Find the <span className="gradient-amber">Best Local</span>
              <br />
              Businesses Near You
            </h1>

            <p className="text-white/70 text-lg md:text-xl font-body leading-relaxed mb-10 max-w-xl">
              Verified shops, services, and professionals — all in one place.
              Browse reviews, get contact info, and discover what your city has
              to offer.
            </p>

            {/* Search Bar */}
            <div className="glass-card rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search businesses, services..."
                  data-ocid="home.search_input"
                  className="pl-10 h-11 border-transparent bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground font-body text-base"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                data-ocid="home.search_button"
                className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-ui font-medium rounded-xl shrink-0"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-white">
                  {approvedBusinesses.length}+
                </p>
                <p className="text-white/60 text-sm font-ui">
                  Verified Businesses
                </p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-white">
                  {CATEGORIES.length - 1}
                </p>
                <p className="text-white/60 text-sm font-ui">Categories</p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-white">
                  {featuredBusinesses.length}
                </p>
                <p className="text-white/60 text-sm font-ui">
                  Featured Listings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 max-w-7xl py-10">
        {/* Search Result Banner */}
        {hasSearched && (
          <div className="flex items-center justify-between mb-6 p-3 bg-secondary/50 rounded-lg border border-border">
            <p className="text-sm font-ui text-foreground">
              <span className="font-medium">{displayedBusinesses.length}</span>{" "}
              result{displayedBusinesses.length !== 1 ? "s" : ""} for
              {searchKeyword && (
                <span className="text-amber ml-1">"{searchKeyword}"</span>
              )}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="text-muted-foreground hover:text-foreground font-ui"
            >
              Clear search
            </Button>
          </div>
        )}

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.label}
                type="button"
                data-ocid={`home.category.tab.${idx + 1}`}
                onClick={() => setActiveCategory(isActive ? null : cat.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-ui font-medium whitespace-nowrap transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Featured Section */}
        {!hasSearched && featuredBusinesses.length > 0 && (
          <div className="mb-10" data-ocid="home.featured_section">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-2xl font-bold text-foreground heading-underline">
                Featured Businesses
              </h2>
              <Star className="w-5 h-5 fill-amber text-amber" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredBusinesses.map((business, idx) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  navigate={navigate}
                  index={idx + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Businesses */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-bold text-foreground heading-underline">
              {hasSearched
                ? "Search Results"
                : activeCategory
                  ? activeCategory
                  : "All Businesses"}
            </h2>
            {!hasSearched && (
              <span className="text-sm text-muted-foreground font-ui">
                {displayedBusinesses.length} listing
                {displayedBusinesses.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={`skeleton-${i + 1}`}
                  className="bg-card rounded-xl border border-border p-5 animate-pulse"
                >
                  <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-full mb-1.5" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : displayedBusinesses.length === 0 ? (
            <div
              data-ocid="home.business.empty_state"
              className="text-center py-16 bg-card rounded-xl border border-border border-dashed"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {hasSearched
                  ? "No matching businesses found"
                  : "No businesses listed yet"}
              </h3>
              <p className="text-muted-foreground text-sm font-body max-w-sm mx-auto mb-4">
                {hasSearched
                  ? "Try different search terms or browse all categories."
                  : "Be the first to register your business in the directory."}
              </p>
              {hasSearched ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSearch}
                  className="font-ui"
                >
                  View All Businesses
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedBusinesses.map((business, idx) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  navigate={navigate}
                  index={idx + 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
