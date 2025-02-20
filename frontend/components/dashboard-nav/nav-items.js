import {
  Building2,
  Filter,
  Globe,
  Heart,
  Home,
  Map,
  Plus,
  ScrollText,
  Store,
  User,
} from "lucide-react";

const commonItems = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/dashboard/profile",
  },
];

export const sellerItems = [
  {
    id: "my-sites",
    label: "My Sites",
    icon: Home,
    href: "/dashboard/sites",
  },
  {
    id: "submit-site",
    label: "Submit New Site",
    icon: Plus,
    href: "/dashboard/sites/new",
  },
  ...commonItems,
];

export const buyerItems = [
  {
    id: "explore-map",
    label: "Explore on Map",
    icon: Map,
    href: "/dashboard/explore",
  },
  {
    id: "shortlisted",
    label: "Shortlisted Sites",
    icon: Heart,
    href: "/dashboard/shortlisted",
  },
  {
    section: "Filters",
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
  ...commonItems,
];

// Admin gets access to all items, with buyer menu first
export const adminItems = [
  ...buyerItems.filter((item) => item.id !== "profile"),
  ...sellerItems.filter((item) => item.id !== "profile"),
  ...commonItems,
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
      return commonItems;
  }
}
