import { FC, useState } from "react";
import { User } from "@/redux/types/auth";
import {
  useDeleteUserMutation,
} from "@/redux/features/apiSlice";
import Button from "../ui/Button";

interface AdminUsersTableProps {
  users: User[];
}

const AdminUsersTable: FC<AdminUsersTableProps> = ({ users }) => {
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setActiveUserId(userId);
      try {
        await deleteUser(userId).unwrap();
      } catch (error) {
        console.error("Failed to delete user:", error);
      } finally {
        setActiveUserId(null);
      }
    }
  };

  if (users.length === 0) {
    return (
      <div className="animate-fade-up-delay-2 rounded-[14px] border border-border bg-card px-6 py-12 text-center">
        <p className="text-[15px] font-medium text-foreground">
          No users found.
        </p>
        <p className="mt-1 text-[13px] text-muted">
          Adjust your search or add new users.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up-delay-2 overflow-x-auto rounded-[14px] border border-border bg-card">
      <table className="w-full min-w-[800px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-border text-[13px] text-muted">
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium">Role</th>
            <th className="px-6 py-4 font-medium">Purchased Courses</th>
            <th className="px-6 py-4 font-medium">Joined</th>
            <th className="px-6 py-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user, index) => {
            const isProcessing =
              isDeleting && activeUserId === user._id;

            return (
              <tr
                key={user._id}
                className={`transition-colors duration-200 hover:bg-muted/5 ${
                  isProcessing ? "opacity-50" : ""
                }`}
                style={{ animationDelay: `${(index + 3) * 50}ms` }}
              >
                <td className="px-6 py-4 font-medium tracking-[-0.01em] text-foreground">
                  <div className="flex items-center gap-3">
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-border text-[12px] font-medium text-muted-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-muted">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                      user.role === "admin"
                        ? "bg-foreground/10 text-foreground"
                        : "bg-border text-muted"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] text-muted">
                  {user.courses?.length || 0}
                </td>
                <td className="px-6 py-4 text-[13px] text-muted">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3 text-[13px]">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={isProcessing || user.role === "admin"}
                      className="text-red-500/70 transition-colors hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={user.role === "admin" ? "Admins cannot be deleted" : "Delete user"}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTable;
