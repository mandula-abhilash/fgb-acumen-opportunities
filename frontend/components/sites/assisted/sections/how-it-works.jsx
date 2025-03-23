"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HowItWorks() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Assisted Submission Service</CardTitle>
        <CardDescription>
          Provide the essential information below and our team will prepare a
          comprehensive site listing for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-100 dark:border-blue-900">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            How it works
          </h3>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>Complete this simplified form with basic site details</li>
            <li>Pay the service fee</li>
            <li>
              Our team will contact you to gather any additional information
            </li>
            <li>
              We'll prepare and publish your site listing within 2-3 business
              days
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
