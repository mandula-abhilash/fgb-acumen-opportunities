import * as z from "zod";

export const opportunityTypes = [
  { value: "section-106", label: "Section 106" },
  { value: "grant-funded", label: "Grant Funded Land & Build" },
  { value: "build-to-rent", label: "Build to Rent" },
  { value: "care", label: "Care" },
  { value: "other", label: "Other" },
];

export const regions = [
  { value: "north-east", label: "North East" },
  { value: "north-west", label: "North West" },
  { value: "yorkshire-humber", label: "Yorkshire and the Humber" },
  { value: "east-midlands", label: "East Midlands" },
  { value: "west-midlands", label: "West Midlands" },
  { value: "east-england", label: "East of England" },
  { value: "london", label: "London" },
  { value: "south-east", label: "South East" },
  { value: "south-west", label: "South West" },
  { value: "wales", label: "Wales" },
  { value: "scotland", label: "Scotland" },
  { value: "northern-ireland", label: "Northern Ireland" },
];

export const lpaOptions = [
  { value: "manchester", label: "Manchester City Council" },
  { value: "liverpool", label: "Liverpool City Council" },
  { value: "leeds", label: "Leeds City Council" },
  { value: "birmingham", label: "Birmingham City Council" },
  { value: "bristol", label: "Bristol City Council" },
  { value: "newcastle", label: "Newcastle City Council" },
  { value: "sheffield", label: "Sheffield City Council" },
  { value: "nottingham", label: "Nottingham City Council" },
  { value: "cardiff", label: "Cardiff Council" },
  { value: "glasgow", label: "Glasgow City Council" },
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

export const submitSiteSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  opportunityType: z.string().min(1, "Opportunity type is required"),
  developerName: z.string().min(1, "Developer name is required"),
  developerRegion: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  googleMapsLink: z.string().url("Please enter a valid Google Maps URL"),
  lpa: z.array(z.string()).min(1, "Please select at least one LPA"),
  region: z.array(z.string()).min(1, "Please select at least one region"),
  planningStatus: z.string().min(1, "Planning status is required"),
  landPurchaseStatus: z.string().min(1, "Land purchase status is required"),
  plots: z.number().min(1, "Number of plots is required"),
  tenures: z.array(z.string()).min(1, "Please select at least one tenure type"),
  startOnSiteDate: z.date().optional(),
  handoverDate: z.date().optional(),
  developerInfo: z.string().optional(),
  siteContext: z.string().optional(),
  planningOverview: z.string().optional(),
  proposedDevelopment: z.string().optional(),
  detailedTenureAccommodation: z.string().optional(),
  paymentTerms: z.string().optional(),
  projectProgramme: z.string().optional(),
  agentTerms: z.string().optional(),
});
