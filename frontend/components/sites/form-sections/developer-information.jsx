"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function DeveloperInformation({ register, setValue, errors, regions }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Information</CardTitle>
        <CardDescription>
          Enter details about the developer and company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="developerName">
              Developer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="developerName"
              {...register("developerName")}
              className={errors.developerName ? "border-destructive" : ""}
            />
            {errors.developerName && (
              <p className="text-sm text-destructive">
                {errors.developerName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="developerRegion">Developer Region</Label>
            <Select
              onValueChange={(value) => setValue("developerRegion", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select developer region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="developerInfo">Additional Information</Label>
          <Textarea
            id="developerInfo"
            {...register("developerInfo")}
            placeholder="Enter any additional information about the developer..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
