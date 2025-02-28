"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, FileEdit, FileSearch, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export function SubmissionOptionsModal({ open, onOpenChange }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelfServiceOption = () => {
    router.push("/dashboard/sites/new");
    onOpenChange(false);
  };

  const handlePaidOption = () => {
    router.push("/dashboard/sites/assisted");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Choose Your Submission Method
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Select how you would like to submit your site information
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Self-Service Option */}
          <div className="border rounded-lg p-6 hover:border-web-orange hover:shadow-md transition-all">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
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
          <div className="border rounded-lg p-6 bg-web-orange/5 border-web-orange shadow-lg">
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

        <div className="bg-gray-50 p-4 rounded-lg mt-2">
          <h4 className="font-semibold mb-2 flex items-center">
            <Coins className="h-4 w-4 mr-2 text-web-orange" />
            Additional Services
          </h4>
          <p className="text-sm text-muted-foreground">
            FGB can also manage the bids process, chase up queries, and provide
            a tender summary report for an additional fee payable by the buyer.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
