"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { Spinner } from "@/components/ui/spinner";
import { ExploreMap } from "@/components/explore/explore-map";
import { PageHeader } from "@/components/layout/page-header";

export default function ExplorePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <PageHeader title="Explore Opportunities" />

      <div className="flex-1 px-6 py-4">
        <ExploreMap />
      </div>
    </div>
  );
}
