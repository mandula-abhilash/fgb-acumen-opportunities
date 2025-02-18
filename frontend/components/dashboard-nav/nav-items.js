import { Filter, Globe, Heart, Home, Map, Plus, User } from "lucide-react";

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
        placeholder: "Enter regions...",
        multiple: true,
      },
      {
        id: "type-filter",
        label: "Property Type",
        icon: Filter,
        type: "filter",
        filterKey: "propertyTypes",
        placeholder: "Select property types...",
        multiple: true,
        options: [
          { value: "residential", label: "Residential" },
          { value: "commercial", label: "Commercial" },
          { value: "mixed", label: "Mixed Use" },
        ],
      },
    ],
  },
  ...commonItems,
];

// Admin gets access to all items
export const adminItems = [
  ...sellerItems.filter((item) => item.id !== "profile"),
  ...buyerItems.filter((item) => item.id !== "profile"),
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
