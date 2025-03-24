"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BuyerSidebar } from "@/components/filters/sidebar/buyer-sidebar";
import { SellerSidebar } from "@/components/filters/sidebar/seller-sidebar";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Close the sidebar when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isOpen &&
        e.target.closest(".mobile-nav-content") === null &&
        e.target.closest(".mobile-nav-toggle") === null
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    // Lock body scroll when nav is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Determine which sidebar to show based on user role
  const renderSidebar = () => {
    if (user?.role === "seller") {
      return <SellerSidebar />;
    }

    // Default to buyer view (also used when user.role === "buyer")
    return <BuyerSidebar />;
  };

  return (
    <>
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed right-4 top-4 z-50 rounded-full md:hidden mobile-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Button>

      {/* Mobile navigation drawer */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`mobile-nav-content fixed top-0 right-0 w-72 h-full bg-background border-l shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {renderSidebar()}
        </div>
      </div>
    </>
  );
}
