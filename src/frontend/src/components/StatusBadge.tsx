import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Status } from "../backend.d";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
  className?: string;
}

export default function StatusBadge({
  status,
  size = "sm",
  className,
}: StatusBadgeProps) {
  const config = {
    [Status.pending]: {
      label: "Pending",
      icon: Clock,
      className: "status-pending border",
    },
    [Status.approved]: {
      label: "Approved",
      icon: CheckCircle,
      className: "status-approved border",
    },
    [Status.rejected]: {
      label: "Rejected",
      icon: XCircle,
      className: "status-rejected border",
    },
  };

  const { label, icon: Icon, className: statusClass } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-ui font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        statusClass,
        className,
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {label}
    </span>
  );
}
