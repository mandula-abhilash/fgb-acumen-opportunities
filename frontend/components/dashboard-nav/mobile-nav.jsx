"use client";

import React, { useState } from "react";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { Menu, X } from "lucide-react";

import { BuyerSidebar } from "@/components/filters/sidebar/buyer-sidebar";
import { SellerSidebar } from "@/components/filters/sidebar/seller-sidebar";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const renderSidebar = () => {
    if (user?.role === "buyer") {
      return <BuyerSidebar />;
    }

    if (user?.role === "seller") {
      return <SellerSidebar />;
    }

    // Default to buyer view
    return <BuyerSidebar />;
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-100 rounded-md shadow-md"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sliding Mobile Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="pt-16 h-full overflow-y-auto">{renderSidebar()}</div>
      </div>

      {/* Overlay when menu is open */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
