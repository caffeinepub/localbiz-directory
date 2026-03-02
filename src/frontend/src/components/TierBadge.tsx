import { cn } from "@/lib/utils";
import { Crown, Shield, Tag } from "lucide-react";
import { Tier } from "../backend.d";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md";
  className?: string;
}

export default function TierBadge({
  tier,
  size = "sm",
  className,
}: TierBadgeProps) {
  const config = {
    [Tier.premium]: {
      label: "Premium",
      icon: Crown,
      className: "tier-premium border",
    },
    [Tier.basic]: {
      label: "Basic",
      icon: Shield,
      className: "tier-basic border",
    },
    [Tier.free]: {
      label: "Free",
      icon: Tag,
      className: "tier-free border",
    },
  };

  const { label, icon: Icon, className: tierClass } = config[tier];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-ui font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        tierClass,
        className,
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {label}
    </span>
  );
}
