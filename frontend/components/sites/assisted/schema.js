import * as z from "zod";

// Phone regex that only allows numbers and some special characters
const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,14}$/;

export const assistedSiteSchema = z.object({
  siteAddress: z.string().min(1, "Site address is required"),
  customSiteAddress: z.string().optional(),
  siteName: z.string().min(1, "Site name is required"),
  opportunityType: z.string().min(1, "Opportunity type is required"),
  plots: z.coerce.number().min(1, "Number of plots must be at least 1"),

  additionalInfo: z.string().optional(),
  sitePlanImage: z.string().optional(),
  sitePlanDocument: z.string().optional(),
  manageBidsProcess: z.boolean().optional(),
  queriesContactName: z
    .string()
    .min(
      1,
      "Please mention the name of the person to whom the queries must be sent."
    ),
  contactPhone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Please enter a valid phone number",
    }),
  contactEmail: z.string().email("Please enter a valid email address"),
});
