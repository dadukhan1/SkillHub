export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function formatRole(role: string): string {
  if (role === "admin") return "Admin";
  return "Learner";
}

export function isAdmin(role: string): boolean {
  return role === "admin";
}

export function getAuthenticatedHomePath(user: { role: string }): string {
  return isAdmin(user.role) ? "/dashboard" : "/profile";
}
