"use client";

import { useEffect, useState } from "react";

import { getRegions } from "@/lib/api/regions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreatableSelect } from "@/components/ui/creatable-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { CreateRegionDialog } from "@/components/regions/create-region-dialog";

export function DeveloperInformation({ register, setValue, watch, errors }) {
  const [developerRegions, setDeveloperRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateRegionOpen, setIsCreateRegionOpen] = useState(false);
  const [newRegionName, setNewRegionName] = useState("");
  const selectedRegions = watch("developerRegion") || [];

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionsData = await getRegions();
        setDeveloperRegions(regionsData);
      } catch (error) {
        console.error("Error fetching developer regions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const handleCreateOption = (inputValue) => {
    setNewRegionName(inputValue);
    setIsCreateRegionOpen(true);
  };

  const handleRegionCreated = (newRegion) => {
    setDeveloperRegions((prevRegions) => [...prevRegions, newRegion]);

    // Add the new region to the selected values
    const currentRegions = Array.isArray(selectedRegions)
      ? selectedRegions
      : [];
    setValue("developerRegion", [...currentRegions, newRegion.value]);
  };

  // Format the value for the multi-select component
  const formatSelectedValues = () => {
    if (!selectedRegions) return [];

    if (!Array.isArray(selectedRegions)) {
      return [
        {
          value: selectedRegions.value || selectedRegions,
          label:
            selectedRegions.label ||
            developerRegions.find((r) => r.value === selectedRegions)?.label ||
            selectedRegions,
        },
      ];
    }

    return selectedRegions.map((region) => {
      if (typeof region === "object" && region !== null) {
        return region;
      }
      return {
        value: region,
        label:
          developerRegions.find((r) => r.value === region)?.label || region,
      };
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Developer Information</CardTitle>
          <CardDescription>Loading regions...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="lg" className="text-web-orange" />
        </CardContent>
      </Card>
    );
  }

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
            <Label htmlFor="developerRegion">
              Developer Region
              <span className="text-xs text-muted-foreground ml-1">
                (Type to search or create new)
              </span>
            </Label>
            <CreatableSelect
              placeholder="Select or create regions"
              loadOptions={async (inputValue) => {
                if (inputValue.length < 1) return [];
                return developerRegions.filter((region) =>
                  region.label.toLowerCase().includes(inputValue.toLowerCase())
                );
              }}
              onCreateOption={handleCreateOption}
              value={formatSelectedValues()}
              onChange={(newValue) => setValue("developerRegion", newValue)}
              isClearable
              isMulti={true}
              isLoading={isLoading}
            />
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

        <CreateRegionDialog
          open={isCreateRegionOpen}
          onOpenChange={setIsCreateRegionOpen}
          onRegionCreated={handleRegionCreated}
          initialName={newRegionName}
        />
      </CardContent>
    </Card>
  );
}
