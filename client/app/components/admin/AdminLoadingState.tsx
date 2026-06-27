"use client";

import { FC } from "react";

interface AdminLoadingStateProps {
  label?: string;
}

const AdminLoadingState: FC<AdminLoadingStateProps> = ({
  label = "Loading dashboard…",
}) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      <p className="mt-4 text-sm text-muted">{label}</p>
    </div>
  </div>
);

export default AdminLoadingState;
