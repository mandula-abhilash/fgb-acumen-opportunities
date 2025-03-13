"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { ArrowLeft, Coins, FileEdit, FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/layout/page-header";

export default function SubmissionOptionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const handleSelfServiceOption = () => {
    router.push("/dashboard/sites/new");
  };

  const handlePaidOption = () => {
    router.push("/dashboard/sites/assisted");
  };

  const handleBackClick = () => {
    router.push("/dashboard/opportunities");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full w-full flex items-center justify-center">
          <Spinner size="lg" className="text-web-orange" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <PageHeader title="Choose Submission Method">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleBackClick}>
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline-block sm:ml-2">
                  Back to Opportunities
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Return to opportunities list</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PageHeader>

      <div className="flex-1 overflow-y-auto px-6 py-4 bg-background/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Self-Service Option */}
            <div className="border rounded-lg p-6 hover:border-web-orange hover:shadow-md transition-all bg-card">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="bg-gray-100 dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <FileEdit className="h-6 w-6 text-web-orange" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Self-Service</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete the full site submission form yourself with all
                    required details.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Full control over all site details</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Immediate submission</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>No additional cost</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold">Free</span>
                  </div>
                  <Button
                    onClick={handleSelfServiceOption}
                    className="w-full bg-white hover:bg-gray-50 text-web-orange font-semibold shadow-md border border-web-orange"
                  >
                    Choose Self-Service
                  </Button>
                </div>
              </div>
            </div>

            {/* Assisted Option */}
            <div className="border rounded-lg p-6 bg-web-orange/5 border-web-orange shadow-2xl">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="bg-web-orange/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <FileSearch className="h-6 w-6 text-web-orange" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">FGB Assisted</h3>
                  <p className="text-muted-foreground mb-4">
                    Provide minimal information and let FGB prepare the complete
                    submission for you.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Minimal effort required from you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Professional preparation by FGB experts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Optimized presentation to attract buyers</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold">£250.00</span>
                  </div>
                  <Button
                    onClick={handlePaidOption}
                    className="w-full bg-web-orange hover:bg-web-orange/90 text-white font-semibold"
                  >
                    Choose FGB Assisted
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-2">
            <h4 className="font-semibold mb-2 flex items-center">
              <Coins className="h-4 w-4 mr-2 text-web-orange" />
              Additional Services
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              FGB can manage the bids process, follow up on queries, and provide
              a tender summary report for an additional fee payable by the
              buyer. For more details, please contact{" "}
              <a
                href="mailto:andy@fgandb.co.uk"
                className="font-medium text-web-orange hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                andy@fgandb.co.uk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
