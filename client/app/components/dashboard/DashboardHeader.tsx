import { FC } from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
    {description && (
      <p className="mt-1 text-sm text-muted">{description}</p>
    )}
  </div>
);

export default DashboardHeader;
