"use client";

import * as z from "zod";

export const opportunityTypes = [
  { value: "section-106", label: "Section 106" },
  { value: "grant-funded", label: "Grant Funded Land & Build" },
  { value: "build-to-rent", label: "Build to Rent" },
  { value: "care", label: "Care" },
  { value: "other", label: "Other" },
];

export const tenureTypes = [
  { value: "social-rent", label: "Social Rent" },
  { value: "affordable-rent", label: "Affordable Rent" },
  { value: "shared-ownership", label: "Shared Ownership" },
  { value: "first-homes", label: "First Homes" },
  { value: "open-market", label: "Open Market" },
  { value: "build-to-rent", label: "Build to Rent" },
  { value: "care", label: "Care" },
];

export const planningStatuses = [
  { value: "allocated", label: "Allocated" },
  { value: "draft-allocation", label: "Draft Allocation" },
  { value: "outline-submission", label: "Outline Submission" },
  { value: "outline-approval", label: "Outline Approval" },
  { value: "full-submission", label: "Full Submission" },
  { value: "full-approval", label: "Full Approval" },
  { value: "detailed-submission", label: "Detailed Submission" },
  { value: "detailed-approval", label: "Detailed Approval" },
  { value: "appeal-lodged", label: "Appeal Lodged" },
  { value: "appeal-allowed", label: "Appeal Allowed" },
];

export const landPurchaseStatuses = [
  { value: "land-offer", label: "Land Offer Stage" },
  { value: "preferred-buyer", label: "Preferred Buyer" },
  { value: "heads-of-terms", label: "Heads of Terms Agreed" },
  { value: "contracts-exchanged", label: "Contracts Exchanged" },
  { value: "purchase-completed", label: "Purchase Completed" },
];

export const vatPositions = [
  { value: "standard", label: "Standard Rate (20%)" },
  { value: "reduced", label: "Reduced Rate (5%)" },
  { value: "zero", label: "Zero Rate (0%)" },
  { value: "exempt", label: "Exempt" },
  { value: "outside-scope", label: "Outside Scope" },
  { value: "not-applicable", label: "Not Applicable" },
];

export const submitSiteSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  customSiteAddress: z.string().min(1, "Custom site address is required"),
  opportunityType: z.string().min(1, "Opportunity type is required"),
  developerName: z.string().min(1, "Developer name is required"),
  developerRegion: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  googleMapsLink: z.string().url("Please enter a valid Google Maps URL"),
  lpa: z.array(z.string()).min(1, "Please select at least one LPA"),
  region: z.array(z.string()).min(1, "Please select at least one region"),
  planningStatus: z.string().min(1, "Planning status is required"),
  landPurchaseStatus: z.string().min(1, "Land purchase status is required"),
  plots: z
    .number()
    .min(1, "Number of plots must be at least 1")
    .int("Number of plots must be a whole number"),
  tenures: z.array(z.string()).min(1, "Please select at least one tenure type"),
  planningSubmissionDate: z.date().optional(),
  planningDeterminationDate: z.date().optional(),
  startOnSiteDate: z.date().optional(),
  firstGoldenBrickDate: z.date().optional(),
  finalGoldenBrickDate: z.date().optional(),
  firstHandoverDate: z.date().optional(),
  finalHandoverDate: z.date().optional(),
  developerInfo: z.string().optional(),
  siteContext: z.string().optional(),
  planningOverview: z.string().optional(),
  proposedDevelopment: z.string().optional(),
  detailedTenureAccommodation: z.string().optional(),
  paymentTerms: z.string().optional(),
  vatPosition: z.string().optional(),
  projectProgramme: z.string().optional(),
  agentTerms: z.string().optional(),
  sitePlanImage: z.string().optional(),
  sitePlanDocument: z.string().optional(),
  proposedSpecification: z.string().optional(),
  s106Agreement: z.string().optional(),
});

export const editSiteSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  customSiteAddress: z.string().min(1, "Custom site address is required"),
  opportunityType: z.string().min(1, "Opportunity type is required"),
  developerName: z.string().min(1, "Developer name is required"),
  developerRegion: z.array(z.any()).optional(),
  googleMapsLink: z.string().url("Please enter a valid Google Maps URL"),
  lpa: z.array(z.string()).min(1, "Please select at least one LPA"),
  region: z.array(z.string()).min(1, "Please select at least one region"),
  planningStatus: z.string().min(1, "Planning status is required"),
  landPurchaseStatus: z.string().min(1, "Land purchase status is required"),
  plots: z
    .number()
    .min(1, "Number of plots must be at least 1")
    .int("Number of plots must be a whole number"),
  tenures: z.array(z.string()).min(1, "Please select at least one tenure type"),
  planningSubmissionDate: z.date().nullable().optional(),
  planningDeterminationDate: z.date().nullable().optional(),
  startOnSiteDate: z.date().nullable().optional(),
  firstGoldenBrickDate: z.date().nullable().optional(),
  finalGoldenBrickDate: z.date().nullable().optional(),
  firstHandoverDate: z.date().nullable().optional(),
  finalHandoverDate: z.date().nullable().optional(),
  developerInfo: z.string().optional(),
  siteContext: z.string().optional(),
  planningOverview: z.string().optional(),
  proposedDevelopment: z.string().optional(),
  detailedTenureAccommodation: z.string().optional(),
  paymentTerms: z.string().optional(),
  vatPosition: z.string().optional(),
  projectProgramme: z.string().optional(),
  agentTerms: z.string().optional(),
  sitePlanImage: z.string().optional(),
  sitePlanDocument: z.string().optional(),
  proposedSpecification: z.string().optional(),
  s106Agreement: z.string().optional(),
});

export const fileTypes = {
  image: ["image/jpeg", "image/png", "image/jpg"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const maxFileSizes = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
};
