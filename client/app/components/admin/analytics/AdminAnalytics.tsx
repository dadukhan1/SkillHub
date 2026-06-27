"use client";

import { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminLoadingState from "@/app/components/admin/AdminLoadingState";
import {
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
  useGetCoursesAnalyticsQuery,
} from "@/redux/features/analyticsApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import type { MonthData } from "@/redux/types/analytics";

interface ChartCardProps {
  title: string;
  subtitle: string;
  data: MonthData[];
  color: string;
  gradientId: string;
}

const ChartCard: FC<ChartCardProps> = ({ title, subtitle, data, color, gradientId }) => {
  return (
    <div className="rounded-[16px] border border-border bg-card p-6 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-current opacity-[0.03] pointer-events-none" style={{ color }} />
      <div className="mb-8">
        <h3 className="text-[17px] font-semibold text-foreground tracking-[-0.01em]">
          {title}
        </h3>
        <p className="text-[13px] text-muted mt-1">{subtitle}</p>
      </div>

      <div className="h-[280px] w-full mt-4 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              dx={-10}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                color: "var(--foreground)",
                padding: "10px 16px",
              }}
              itemStyle={{ color: "var(--foreground)", fontWeight: 500, fontSize: "14px" }}
              labelStyle={{ color: "var(--muted-foreground)", marginBottom: "4px", fontSize: "12px" }}
              cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 6, strokeWidth: 0, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AdminAnalytics: FC = () => {
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetUsersAnalyticsQuery();
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useGetOrdersAnalyticsQuery();
  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useGetCoursesAnalyticsQuery();

  if (usersLoading || ordersLoading || coursesLoading) {
    return <AdminLoadingState />;
  }

  const hasError = usersError || ordersError || coursesError;
  if (hasError) {
    const errorMsg = getErrorMessage(usersError || ordersError || coursesError, "Failed to load analytics data.");
    return (
      <div className="rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
        <p className="text-sm text-red-500">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-32">
      <AdminPageHeader
        label="Analytics & Insights"
        title="Performance Metrics"
        description="Visualize your platform's growth over the last 12 months with real-time data."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Users Chart - Wide */}
        <div className="lg:col-span-2">
          <ChartCard
            title="User Growth"
            subtitle="New user registrations over the past 12 months"
            data={usersData?.users.last12Months ?? []}
            color="#8b5cf6" // Violet
            gradientId="colorUsers"
          />
        </div>

        {/* Orders Chart */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Sales Trends"
            subtitle="Course enrollments & purchases"
            data={ordersData?.orders.last12Months ?? []}
            color="#10b981" // Emerald
            gradientId="colorOrders"
          />
        </div>

        {/* Courses Chart */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Content Velocity"
            subtitle="New courses published"
            data={coursesData?.courses.last12Months ?? []}
            color="#0ea5e9" // Sky blue
            gradientId="colorCourses"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
