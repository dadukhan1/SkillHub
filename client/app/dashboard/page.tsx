import Link from "next/link";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import AnalyticsWidget from "@/app/components/dashboard/AnalyticsWidget";
import CourseTrackingCard from "@/app/components/dashboard/CourseTrackingCard";
import Button from "@/app/components/ui/Button";
import { dashboardCourses } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardHeader
          title="Good morning, Jane"
          description="You're on a 14-day streak. Keep the momentum going."
        />
        <Link href="#courses">
          <Button variant="secondary" size="sm">
            Explore courses
          </Button>
        </Link>
      </div>

      <AnalyticsWidget />

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Continue learning</h2>
          <Link href="/dashboard/courses" className="text-sm text-accent hover:text-accent-hover">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {dashboardCourses.map((course) => (
            <CourseTrackingCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold tracking-tight">Weekly activity</h2>
          <p className="mt-1 text-sm text-muted">Hours spent learning this week</p>
          <div className="mt-6 flex items-end justify-between gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const heights = [40, 65, 45, 80, 55, 30, 70];
              return (
                <div key={day} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full max-w-8 rounded-md bg-accent/20 transition-all duration-300 hover:bg-accent/40"
                    style={{ height: `${heights[i]}px` }}
                  />
                  <span className="text-[10px] text-muted">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold tracking-tight">Upcoming</h2>
          <p className="mt-1 text-sm text-muted">Your scheduled sessions</p>
          <ul className="mt-5 space-y-3">
            {[
              { title: "React Patterns — Module 4", time: "Today, 2:00 PM" },
              { title: "TypeScript Quiz", time: "Tomorrow, 10:00 AM" },
              { title: "System Design Live Session", time: "Fri, 4:00 PM" },
            ].map((item) => (
              <li
                key={item.title}
                className="flex items-center justify-between rounded-xl border border-border bg-surface/50 px-4 py-3"
              >
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
