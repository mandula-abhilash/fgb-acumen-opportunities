"use client";

import { usePathname } from "next/navigation";
import { GoogleMapsProvider } from "@/contexts/google-maps-context";

import { DashboardNav } from "@/components/dashboard-nav";
import { MainLayout } from "@/components/layout/main-layout";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const getActiveTab = () => {
    if (pathname.includes("/requests")) return "my-requests";
    if (pathname.includes("/profile")) return "profile";
    return "new-request";
  };

  return (
    <MainLayout>
      <GoogleMapsProvider>
        <div className="h-[calc(100vh-3.5rem)] flex">
          <div className="hidden lg:block h-full border-r">
            <DashboardNav activeTab={getActiveTab()} />
          </div>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </GoogleMapsProvider>
    </MainLayout>
  );
}
