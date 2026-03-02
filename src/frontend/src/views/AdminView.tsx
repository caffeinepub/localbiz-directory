import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CheckCircle,
  Clock,
  Loader2,
  MessageSquare,
  Shield,
  Star,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { View } from "../App";
import { Business, Status, Tier } from "../backend.d";
import { backend } from "../backendClient";
import StatusBadge from "../components/StatusBadge";
import TierBadge from "../components/TierBadge";

interface AdminViewProps {
  navigate: (view: View) => void;
  isAdmin: boolean;
}

export default function AdminView({ navigate, isAdmin }: AdminViewProps) {
  const queryClient = useQueryClient();

  const { data: pendingBusinesses = [], isLoading: pendingLoading } = useQuery({
    queryKey: ["pendingBusinesses"],
    queryFn: () => backend.getPendingBusinesses(),
    enabled: isAdmin,
    staleTime: 15_000,
  });

  const { data: allBusinesses = [], isLoading: allLoading } = useQuery({
    queryKey: ["allBusinesses"],
    queryFn: () => backend.getAllBusinesses(),
    enabled: isAdmin,
    staleTime: 15_000,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => backend.getAnalytics(),
    enabled: isAdmin,
    staleTime: 30_000,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["pendingBusinesses"] });
    queryClient.invalidateQueries({ queryKey: ["allBusinesses"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
    queryClient.invalidateQueries({ queryKey: ["approvedBusinesses"] });
    queryClient.invalidateQueries({ queryKey: ["featuredBusinesses"] });
  };

  const approveMutation = useMutation({
    mutationFn: (id: string) => backend.approveBusiness(id),
    onSuccess: () => {
      toast.success("Business approved!");
      invalidateAll();
    },
    onError: () => toast.error("Failed to approve business."),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => backend.rejectBusiness(id),
    onSuccess: () => {
      toast.success("Business rejected.");
      invalidateAll();
    },
    onError: () => toast.error("Failed to reject business."),
  });

  const setFeaturedMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      backend.setFeatured(id, isFeatured),
    onSuccess: () => {
      toast.success("Featured status updated!");
      invalidateAll();
    },
    onError: () => toast.error("Failed to update featured status."),
  });

  const setTierMutation = useMutation({
    mutationFn: ({ id, tier }: { id: string; tier: Tier }) =>
      backend.setTier(id, tier),
    onSuccess: () => {
      toast.success("Tier updated!");
      invalidateAll();
    },
    onError: () => toast.error("Failed to update tier."),
  });

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">
          Access Denied
        </h2>
        <p className="text-muted-foreground font-body mb-6">
          You don't have permission to access the admin panel.
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
    <div className="container mx-auto px-4 max-w-7xl py-8">
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-ui font-medium mb-3">
            <Shield className="w-3.5 h-3.5" />
            Admin Panel
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Business Management
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Review, approve, and manage all business listings
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-center px-4 py-2 bg-card border border-border rounded-lg">
            <p className="font-display font-bold text-xl text-foreground">
              {pendingBusinesses.length}
            </p>
            <p className="text-xs text-muted-foreground font-ui">Pending</p>
          </div>
          <div className="text-center px-4 py-2 bg-card border border-border rounded-lg">
            <p className="font-display font-bold text-xl text-foreground">
              {allBusinesses.length}
            </p>
            <p className="text-xs text-muted-foreground font-ui">Total</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-6 font-ui">
          <TabsTrigger
            value="pending"
            data-ocid="admin.pending_tab"
            className="font-ui"
          >
            Pending Approvals
            {pendingBusinesses.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-amber/20 text-amber-dark font-medium">
                {pendingBusinesses.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="all"
            data-ocid="admin.all_businesses_tab"
            className="font-ui"
          >
            All Businesses
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            data-ocid="admin.analytics_tab"
            className="font-ui"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* ── Pending Approvals ─────────────────────────────────────────── */}
        <TabsContent value="pending">
          {pendingLoading ? (
            <PendingLoadingSkeleton />
          ) : pendingBusinesses.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-border border-dashed">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                All caught up!
              </h3>
              <p className="text-muted-foreground text-sm font-body">
                No pending businesses to review.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBusinesses.map((biz, idx) => (
                <div
                  key={biz.id}
                  data-ocid={`admin.pending.item.${idx + 1}`}
                  className="bg-card rounded-xl border border-border p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-foreground">
                          {biz.name}
                        </h3>
                        <StatusBadge status={biz.status} />
                        <span className="px-2 py-0.5 rounded-full text-xs font-ui bg-secondary text-secondary-foreground border border-border">
                          {biz.category}
                        </span>
                      </div>
                      {biz.description && (
                        <p className="text-sm text-muted-foreground font-body mb-2 line-clamp-2">
                          {biz.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>{biz.address}</span>
                        {biz.phone && <span>📞 {biz.phone}</span>}
                        {biz.email && <span>✉️ {biz.email}</span>}
                        {biz.hours && <span>🕐 {biz.hours}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(biz.id)}
                        disabled={approveMutation.isPending}
                        data-ocid={`admin.pending.approve_button.${idx + 1}`}
                        className="bg-green-600 hover:bg-green-700 text-white font-ui"
                      >
                        {approveMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectMutation.mutate(biz.id)}
                        disabled={rejectMutation.isPending}
                        data-ocid={`admin.pending.reject_button.${idx + 1}`}
                        className="border-destructive/50 text-destructive hover:bg-destructive/10 font-ui"
                      >
                        {rejectMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── All Businesses ────────────────────────────────────────────── */}
        <TabsContent value="all">
          {allLoading ? (
            <AllLoadingSkeleton />
          ) : allBusinesses.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-border border-dashed">
              <Building2 className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                No businesses registered
              </h3>
              <p className="text-muted-foreground text-sm font-body">
                Businesses will appear here once registered.
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                        Business
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                        Featured
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                        Tier
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBusinesses.map((biz, idx) => (
                      <tr
                        key={biz.id}
                        data-ocid={`admin.all.item.${idx + 1}`}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-ui font-medium text-foreground text-sm">
                              {biz.name}
                            </p>
                            {biz.address && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {biz.address}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs font-ui text-muted-foreground">
                            {biz.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={biz.status} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Switch
                            checked={biz.isFeatured}
                            onCheckedChange={(checked) =>
                              setFeaturedMutation.mutate({
                                id: biz.id,
                                isFeatured: checked,
                              })
                            }
                            data-ocid={`admin.all.featured_toggle.${idx + 1}`}
                            disabled={setFeaturedMutation.isPending}
                            aria-label={`Toggle featured for ${biz.name}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Select
                            value={biz.tier}
                            onValueChange={(val) =>
                              setTierMutation.mutate({
                                id: biz.id,
                                tier: val as Tier,
                              })
                            }
                          >
                            <SelectTrigger
                              data-ocid={`admin.all.tier_select.${idx + 1}`}
                              className="h-7 w-28 text-xs font-ui border-border"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value={Tier.free}
                                className="text-xs font-ui"
                              >
                                Free
                              </SelectItem>
                              <SelectItem
                                value={Tier.basic}
                                className="text-xs font-ui"
                              >
                                Basic
                              </SelectItem>
                              <SelectItem
                                value={Tier.premium}
                                className="text-xs font-ui"
                              >
                                Premium
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {biz.status !== Status.approved && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => approveMutation.mutate(biz.id)}
                                disabled={approveMutation.isPending}
                                data-ocid={`admin.all.approve_button.${idx + 1}`}
                                className="h-7 px-2 text-xs font-ui text-green-700 hover:bg-green-50 hover:text-green-800"
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Approve
                              </Button>
                            )}
                            {biz.status !== Status.rejected && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => rejectMutation.mutate(biz.id)}
                                disabled={rejectMutation.isPending}
                                data-ocid={`admin.all.reject_button.${idx + 1}`}
                                className="h-7 px-2 text-xs font-ui text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Analytics ─────────────────────────────────────────────────── */}
        <TabsContent value="analytics">
          {analyticsLoading ? (
            <AnalyticsLoadingSkeleton />
          ) : analytics ? (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Businesses"
                  value={analytics.totalBusinesses.toString()}
                  icon={Building2}
                  color="text-amber"
                  bg="bg-amber/10"
                  dataOcid="admin.analytics.total_businesses"
                />
                <StatCard
                  label="Pending Review"
                  value={analytics.pendingCount.toString()}
                  icon={Clock}
                  color="text-yellow-600"
                  bg="bg-yellow-50"
                  dataOcid="admin.analytics.pending_count"
                />
                <StatCard
                  label="Approved"
                  value={analytics.approvedCount.toString()}
                  icon={CheckCircle}
                  color="text-green-600"
                  bg="bg-green-50"
                  dataOcid="admin.analytics.approved_count"
                />
                <StatCard
                  label="Total Reviews"
                  value={analytics.totalReviews.toString()}
                  icon={MessageSquare}
                  color="text-blue-600"
                  bg="bg-blue-50"
                  dataOcid="admin.analytics.total_reviews"
                />
              </div>

              {/* Category Breakdown */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-amber" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Businesses by Category
                  </h2>
                </div>

                {analytics.categoryCounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-body">
                    No category data available.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {[...analytics.categoryCounts]
                      .sort((a, b) => Number(b.count - a.count))
                      .map(({ category, count }) => {
                        const maxCount = Math.max(
                          ...analytics.categoryCounts.map((c) =>
                            Number(c.count),
                          ),
                        );
                        const pct =
                          maxCount > 0 ? (Number(count) / maxCount) * 100 : 0;
                        return (
                          <div
                            key={category}
                            className="flex items-center gap-3"
                          >
                            <span className="text-sm font-ui text-foreground w-28 shrink-0">
                              {category}
                            </span>
                            <div className="flex-1 bg-muted rounded-full h-2.5">
                              <div
                                className="h-full bg-amber rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-sm font-ui font-medium text-foreground w-6 text-right shrink-0">
                              {count.toString()}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Featured Businesses */}
              <FeaturedAnalyticsPanel />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground font-body">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-40" />
              Failed to load analytics.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Sub Components ────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  dataOcid: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  dataOcid,
}: StatCardProps) {
  return (
    <div
      data-ocid={dataOcid}
      className="bg-card rounded-xl border border-border p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}
        >
          <Icon className={`w-4.5 h-4.5 ${color}`} />
        </div>
      </div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground font-ui mt-0.5">{label}</p>
    </div>
  );
}

function FeaturedAnalyticsPanel() {
  const { data: featured = [] } = useQuery({
    queryKey: ["featuredBusinesses"],
    queryFn: () => backend.getFeaturedBusinesses(),
    staleTime: 30_000,
  });

  if (featured.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
          <Star className="w-4 h-4 text-amber fill-amber" />
        </div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Featured Businesses ({featured.length})
        </h2>
      </div>
      <div className="space-y-2">
        {featured.map((biz, idx) => (
          <div
            key={biz.id}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-ui w-5">
                {idx + 1}.
              </span>
              <span className="font-ui font-medium text-sm text-foreground">
                {biz.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {biz.category}
              </span>
            </div>
            <TierBadge tier={biz.tier} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-card rounded-xl border border-border p-5 animate-pulse"
        >
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-8 w-20 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AllLoadingSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
      <div className="p-4 border-b border-border bg-muted/40 h-10" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border-b border-border flex gap-4">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/6" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card rounded-xl border border-border p-5 animate-pulse"
          >
            <div className="h-9 w-9 bg-muted rounded-lg mb-3" />
            <div className="h-8 bg-muted rounded w-16 mb-1" />
            <div className="h-3 bg-muted rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
