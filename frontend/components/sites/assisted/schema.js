import * as z from "zod";

// Phone regex that only allows numbers and some special characters
const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,14}$/;

export const assistedSiteSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteAddress: z.string().min(1, "Site address is required"),
  customSiteAddress: z.string().min(1, "Custom site address is required"),
  opportunityType: z.string().min(1, "Opportunity type is required"),
  developerName: z.string().min(1, "Developer name is required"),
  plots: z.number().min(1, "Number of plots must be at least 1"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Please enter a valid phone number",
    }),
  additionalInfo: z.string().optional(),
  sitePlanImage: z.string().optional(),
  manageBidsProcess: z.boolean().optional(),
  initialEOIDate: z.date().optional(),
  bidSubmissionDate: z.date().optional(),
  queriesContactName: z.string().optional(),
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
});
