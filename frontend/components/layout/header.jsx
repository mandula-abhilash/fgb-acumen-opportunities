"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { CirclePower, Menu, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MobileNav } from "@/components/dashboard-nav/mobile-nav";
import LogoBlack from "@/components/logo/LogoBlack";
import LogoWhite from "@/components/logo/LogoWhite";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const isLoggedIn = !!user;

  const getActiveTab = () => {
    if (pathname.includes("/opportunities")) return "live-opportunities";
    if (pathname.includes("/requests")) return "my-requests";
    if (pathname.includes("/profile")) return "profile";
    if (pathname.includes("/explore")) return "explore-map";
    if (pathname.includes("/shortlisted")) return "shortlisted";
    if (pathname.includes("/sites/new")) return "submit-site";
    return "live-opportunities";
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  // Don't show auth buttons while loading
  if (loading) {
    return (
      <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
        <div className="flex h-12 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="block ml-2 dark:hidden w-48 h-10">
              <LogoBlack />
            </div>
            <div className="hidden md:-ml-6 dark:block w-48 h-10">
              <LogoWhite />
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
      <div className="flex h-12 items-center justify-between px-4 md:px-6">
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center space-x-2"
        >
          <div className="block ml-2 dark:hidden w-48 h-10">
            <LogoBlack />
          </div>
          <div className="hidden md:-ml-6 dark:block w-48 h-10">
            <LogoWhite />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/dashboard/profile">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <User className="h-5 w-5" />
                        <span className="sr-only">Profile</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={handleLogout}
                    >
                      <CirclePower className="h-5 w-5" />
                      <span className="sr-only">Logout</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Access your account and navigation options
              </SheetDescription>
              <nav className="flex flex-col space-y-4 mt-8">
                {isLoggedIn ? (
                  <>
                    <MobileNav
                      activeTab={getActiveTab()}
                      onClose={() => setIsOpen(false)}
                    />
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      <CirclePower className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full justify-start bg-web-orange hover:bg-web-orange/90 text-white">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
