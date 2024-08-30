import { Skeleton } from "./ui/skeleton";
import { cn } from "~/lib/utils";
import React, { ReactNode } from "react";

function SkeletonWrapper({
  children,
  isLoading,
  fullWidth = true,
}: {
  children: ReactNode;
  isLoading: Boolean;
  fullWidth?: Boolean;
}) {
  if (!isLoading) return children;
  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="rounded-lg bg-slate-300 text-white opacity-50">
        <div className="opacity-0">{children}</div>
      </div>
    </Skeleton>
  );
}

export default SkeletonWrapper;
