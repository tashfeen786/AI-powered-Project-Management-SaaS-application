"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";

export function DashboardHeader() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "User";

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
      <p className="text-text-secondary text-sm">Welcome back, {firstName} 👋 Manage your projects with AI assistance.</p>
    </div>
  );
}
