"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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
import { Textarea } from "@/components/ui/textarea";

export function DeveloperInformation({
  register,
  setValue,
  watch,
  errors,
  regions,
}) {
  const [developerRegions, setDeveloperRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectedRegion = watch("developerRegion");

  // This would be replaced with actual API call in production
  const fetchDeveloperRegions = async (inputValue) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await axios.get(`/api/developer-regions?search=${inputValue}`);
      // return response.data;

      // For demo purposes, we'll filter the existing regions
      const filteredRegions = regions
        .filter((region) =>
          region.label.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((region) => ({
          value: region.value,
          label: region.label,
        }));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return filteredRegions;
    } catch (error) {
      console.error("Error fetching developer regions:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRegion = (inputValue) => {
    // In a real implementation, this would create a new region in the database
    // and then return the new region object
    const newRegion = {
      value: inputValue.toLowerCase().replace(/\s+/g, "-"),
      label: inputValue,
    };

    // Update the form value
    setValue("developerRegion", newRegion);

    // In a real implementation, you would save this to the database
    // For example:
    // axios.post('/api/developer-regions', { name: inputValue })
    //   .then(response => {
    //     console.log('Region created:', response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error creating region:', error);
    //   });
  };

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
              placeholder="Select or create a region"
              loadOptions={fetchDeveloperRegions}
              onCreateOption={handleCreateRegion}
              value={
                selectedRegion
                  ? {
                      value: selectedRegion.value || selectedRegion,
                      label:
                        selectedRegion.label ||
                        regions.find((r) => r.value === selectedRegion)
                          ?.label ||
                        selectedRegion,
                    }
                  : null
              }
              onChange={(newValue) =>
                setValue("developerRegion", newValue?.value || null)
              }
              isClearable
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
      </CardContent>
    </Card>
  );
}
