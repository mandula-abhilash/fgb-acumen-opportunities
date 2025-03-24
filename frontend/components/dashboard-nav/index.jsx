"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export function DashboardNav({ activeTab }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="hidden lg:block h-full border-r">
        <DesktopNav activeTab={activeTab} />
      </div>
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </>
  );
}
