"use client";

import { FC, FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  useGetMeQuery,
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
  useUpdateUserInfoMutation,
} from "@/redux/features/apiSlice";
import { useAuth } from "@/redux/hooks";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import { fileToBase64 } from "@/lib/files";
import { formatRole } from "@/lib/user";
import { cn } from "@/lib/utils";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import UserAvatar from "../../ui/UserAvatar";

const ProfileInfoForm: FC = () => {
  const { user } = useAuth();
  const [updateUserInfo, { isLoading }] = useUpdateUserInfoMutation();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await updateUserInfo({ name, email }).unwrap();
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update profile."));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" size="sm" disabled={isLoading}>
        {isLoading ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
};

const ProfileAvatarUpload: FC = () => {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateProfilePicture, { isLoading }] = useUpdateProfilePictureMutation();

  if (!user) return null;

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB.");
      return;
    }

    try {
      const avatar = await fileToBase64(file);
      await updateProfilePicture({ avatar }).unwrap();
      toast.success("Profile picture updated.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update profile picture."));
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-5">
      <UserAvatar name={user.name} src={user.avatar?.url} size="lg" />
      <div>
        <p className="text-[13px] font-medium">{user.name}</p>
        <p className="mt-0.5 text-[12px] text-muted">{user.email}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={isLoading}
            onClick={() => inputRef.current?.click()}
          >
            {isLoading ? "Uploading…" : "Change photo"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
        </div>
        <p className="mt-2 text-[11px] text-muted">JPG, PNG or GIF. Max 2 MB.</p>
      </div>
    </div>
  );
};

const ProfilePasswordForm: FC = () => {
  const { user } = useAuth();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!user) return null;

  const hasPassword = user.hasPassword ?? false;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (hasPassword && !oldPassword) {
      setError("Please enter your current password.");
      return;
    }

    try {
      const result = await updatePassword({
        ...(hasPassword ? { oldPassword } : {}),
        newPassword,
      }).unwrap();
      toast.success(result.message ?? "Password saved successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to update password."));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!hasPassword && (
        <p className="rounded-[12px] border border-border bg-surface px-3.5 py-3 text-[13px] leading-relaxed text-muted">
          You signed in with Google or GitHub, so there is no password on your
          account yet. Set one below to also sign in with email and password.
        </p>
      )}

      {hasPassword && (
        <Input
          label="Current password"
          type="password"
          name="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      )}

      <Input
        label={hasPassword ? "New password" : "Password"}
        type="password"
        name="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
        minLength={6}
        required
      />
      <Input
        label={hasPassword ? "Confirm new password" : "Confirm password"}
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        error={error}
        required
      />
      <Button type="submit" size="sm" disabled={isLoading}>
        {isLoading
          ? "Saving…"
          : hasPassword
            ? "Update password"
            : "Set password"}
      </Button>
    </form>
  );
};

const VerificationStatus: FC<{ isVerified: boolean }> = ({ isVerified }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium",
      isVerified
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    )}
  >
    <span
      className={cn(
        "h-1.5 w-1.5 rounded-full",
        isVerified ? "bg-emerald-500" : "bg-amber-500",
      )}
      aria-hidden
    />
    {isVerified ? "Verified" : "Pending verification"}
  </span>
);

const ProfileSettings: FC = () => {
  const { user } = useAuth();
  const { refetch } = useGetMeQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-[16px] border border-border bg-card p-6">
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">Profile picture</h2>
        <p className="mt-1 text-[13px] text-muted">
          Upload a photo to personalize your account.
        </p>
        <div className="mt-5">
          <ProfileAvatarUpload />
        </div>
      </section>

      <section className="rounded-[16px] border border-border bg-card p-6">
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">Personal information</h2>
        <p className="mt-1 text-[13px] text-muted">
          Update your name and email address.
        </p>
        <div className="mt-5">
          <ProfileInfoForm />
        </div>
      </section>

      <section className="rounded-[16px] border border-border bg-card p-6">
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">Account details</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-[12px] text-muted">Role</dt>
            <dd className="mt-1 text-[13px] font-medium">{formatRole(user.role)}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-muted">Email verification</dt>
            <dd className="mt-1">
              <VerificationStatus isVerified={user.isVerified} />
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-muted">Sign-in method</dt>
            <dd className="mt-1 text-[13px] font-medium">
              {(user.hasPassword ?? false) ? "Email & password" : "Social account"}
              {(user.hasPassword ?? false) ? "" : " (password not set)"}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-muted">Enrolled courses</dt>
            <dd className="mt-1 text-[13px] font-medium tabular-nums">
              {user.courses?.length ?? 0}
            </dd>
          </div>
          {memberSince && (
            <div>
              <dt className="text-[12px] text-muted">Member since</dt>
              <dd className="mt-1 text-[13px] font-medium">{memberSince}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="rounded-[16px] border border-border bg-card p-6">
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">
          {(user.hasPassword ?? false) ? "Change password" : "Set a password"}
        </h2>
        <p className="mt-1 text-[13px] text-muted">
          {(user.hasPassword ?? false)
            ? "Enter your current password, then choose a new one."
            : "Create a password so you can also sign in with your email."}
        </p>
        <div className="mt-5">
          <ProfilePasswordForm />
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;
