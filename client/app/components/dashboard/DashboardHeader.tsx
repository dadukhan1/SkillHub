import { FC } from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ title, description }) => (
  <div>
    <h1 className="font-display text-2xl font-medium tracking-[-0.02em]">{title}</h1>
    {description && <p className="mt-2 text-[14px] leading-relaxed text-muted">{description}</p>}
  </div>
);

export default DashboardHeader;
