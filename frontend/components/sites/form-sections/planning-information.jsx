"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function PlanningInformation({
  register,
  setValue,
  errors,
  planningStatuses,
  landPurchaseStatuses,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planning Information</CardTitle>
        <CardDescription>
          Enter details about planning status and approvals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="planningStatus">
              Planning Status <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("planningStatus", value)}
            >
              <SelectTrigger
                className={errors.planningStatus ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select planning status" />
              </SelectTrigger>
              <SelectContent>
                {planningStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.planningStatus && (
              <p className="text-sm text-destructive">
                {errors.planningStatus.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="landPurchaseStatus">
              Land Purchase Status <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("landPurchaseStatus", value)}
            >
              <SelectTrigger
                className={
                  errors.landPurchaseStatus ? "border-destructive" : ""
                }
              >
                <SelectValue placeholder="Select land purchase status" />
              </SelectTrigger>
              <SelectContent>
                {landPurchaseStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.landPurchaseStatus && (
              <p className="text-sm text-destructive">
                {errors.landPurchaseStatus.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="planningOverview">Planning Overview</Label>
          <Textarea
            id="planningOverview"
            {...register("planningOverview")}
            placeholder="Provide an overview of the planning situation..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposedDevelopment">Proposed Development</Label>
          <Textarea
            id="proposedDevelopment"
            {...register("proposedDevelopment")}
            placeholder="Describe the proposed development..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
