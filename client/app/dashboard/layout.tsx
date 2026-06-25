import Sidebar from "@/app/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
