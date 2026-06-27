"use client";

import { FC, useMemo, useState } from "react";
import AdminUsersTable from "@/app/components/admin/AdminUsersTable";
import AdminLoadingState from "@/app/components/admin/AdminLoadingState";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminSearchInput from "@/app/components/admin/AdminSearchInput";
import { useGetAllUsersQuery } from "@/redux/features/apiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";

const AdminUsersPage: FC = () => {
  const { data, isLoading, isError, error } = useGetAllUsersQuery();
  const [search, setSearch] = useState("");

  const users = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const lowercasedSearch = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedSearch) ||
        user.email.toLowerCase().includes(lowercasedSearch) ||
        user.role.toLowerCase().includes(lowercasedSearch)
    );
  }, [users, search]);

  if (isLoading) {
    return <AdminLoadingState label="Loading users…" />;
  }

  if (isError) {
    return (
      <div className="rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
        <p className="text-sm text-red-500">
          {getErrorMessage(error, "Failed to load users.")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        label="Users module"
        title={
          <>
            Manage your users.
            <br />
            <span className="text-muted">Grow with purpose.</span>
          </>
        }
        description="View, search, and maintain user access across the platform. Assign roles carefully, designed for real growth."
      />

      <div className="animate-fade-up-delay-2 mt-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, or role…"
            className="sm:max-w-md"
          />
          <p className="text-[13px] text-muted">
            {filteredUsers.length} of {users.length} users
          </p>
        </div>

        <AdminUsersTable users={filteredUsers} />
      </div>

      <div className="animate-fade-up-delay-3 mt-10 border-t border-border pt-8">
        <p className="label mb-4">Trusted by teams at</p>
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-[13px] font-medium text-muted-foreground">
          {["Vercel", "Stripe", "Notion", "Linear", "Figma"].map((company) => (
            <span key={company} className="transition-colors duration-200 hover:text-muted">
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
