"use client";

import * as z from "zod";

// Phone regex that only allows numbers and some special characters
const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,14}$/;

export const assistedSubmissionSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  opportunityType: z.string().min(1, "Opportunity type is required"),
  developerName: z.string().min(1, "Developer name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Please enter a valid phone number",
    }),
  additionalInfo: z.string().optional(),
  initialEOIDate: z.date().optional(),
  bidSubmissionDate: z.date().optional(),
  manageBidsProcess: z.boolean().optional(),
  queriesContactName: z.string().min(1, "Contact name is required").optional(),
  queriesContactEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional(),
  queriesContactPhone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Please enter a valid phone number",
    }),
  sitePlanImage: z.string().optional(),
});
