import {
  Briefcase,
  Building2,
  Filter,
  Globe,
  Heart,
  List,
  Map,
  Plus,
  ScrollText,
  Store,
} from "lucide-react";

// Common items that appear at the top of the navigation for all user types
const commonTopItems = [
  {
    id: "live-opportunities",
    label: "Live Opportunities",
    icon: Briefcase,
    href: "/dashboard/opportunities",
  },
];

export const sellerItems = [...commonTopItems];

export const buyerItems = [
  ...commonTopItems,
  {
    id: "view-mode",
    label: "View Mode",
    type: "toggle",
    options: [
      { value: "list", label: "List View", icon: List },
      { value: "map", label: "Map View", icon: Map },
    ],
  },
  {
    id: "shortlisted",
    label: "Show Shortlisted Only",
    icon: Heart,
    type: "checkbox",
  },
  {
    section: "FILTERS",
    items: [
      {
        id: "region-filter",
        label: "Region",
        icon: Globe,
        type: "filter",
        filterKey: "regions",
        placeholder: "Select regions...",
        multiple: true,
        options: [
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
        ],
      },
      {
        id: "plots-filter",
        label: "Number of Plots",
        icon: Building2,
        type: "plots-range",
        filterKey: "plots",
        modes: [
          { value: "between", label: "Between" },
          { value: "more-than", label: "More than" },
          { value: "less-than", label: "Less than" },
        ],
        fields: {
          min: {
            label: "Minimum Plots",
            placeholder: "Min plots",
          },
          max: {
            label: "Maximum Plots",
            placeholder: "Max plots",
          },
          single: {
            moreThan: {
              label: "Minimum Plots",
              placeholder: "Enter minimum plots",
            },
            lessThan: {
              label: "Maximum Plots",
              placeholder: "Enter maximum plots",
            },
          },
        },
      },
      {
        id: "planning-status-filter",
        label: "Planning Status",
        icon: ScrollText,
        type: "filter",
        filterKey: "planningStatus",
        placeholder: "Select planning status...",
        multiple: true,
        options: [
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
        ],
      },
      {
        id: "land-purchase-status-filter",
        label: "Land Purchase Status",
        icon: Store,
        type: "filter",
        filterKey: "landPurchaseStatus",
        placeholder: "Select purchase status...",
        multiple: true,
        options: [
          { value: "land-offer", label: "Land Offer Stage" },
          { value: "preferred-buyer", label: "Preferred Buyer" },
          { value: "heads-of-terms", label: "Heads of Terms Agreed" },
          { value: "contracts-exchanged", label: "Contracts Exchanged" },
          { value: "purchase-completed", label: "Purchase Completed" },
        ],
      },
    ],
  },
];

// Admin gets access to all items, with buyer menu first
export const adminItems = [
  ...commonTopItems,
  ...buyerItems.filter((item) => !commonTopItems.find((c) => c.id === item.id)),
  ...sellerItems.filter(
    (item) => !commonTopItems.find((c) => c.id === item.id)
  ),
];

export function getNavItems(role) {
  switch (role) {
    case "seller":
      return sellerItems;
    case "buyer":
      return buyerItems;
    case "admin":
      return adminItems;
    default:
      return commonTopItems;
  }
}
