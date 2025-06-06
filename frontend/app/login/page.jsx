"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MainLayout } from "@/components/layout/main-layout";

const loginSchema = {
  email: "Please enter a valid email address",
  password: "Password is required",
};

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: (data) => {
      const errors = {};
      if (!data.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        errors.email = loginSchema.email;
      }
      if (!data.password) {
        errors.password = loginSchema.password;
      }
      return { values: data, errors };
    },
  });

  const onSubmit = async (data) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          error.response?.data?.message || "Invalid email or password",
      });
    }
  };

  // Show nothing while checking auth status
  if (loading || (!loading && user)) {
    return null;
  }

  return (
    <MainLayout>
      <main className="flex items-center justify-center min-h-[calc(100vh-7rem)] px-4 md:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-card p-8 md:my-10">
            <div className="space-y-2 text-center mb-8">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-havelock-blue hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-web-orange hover:bg-web-orange/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-havelock-blue hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t bg-background/60 backdrop-blur-sm h-14">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center h-14 text-sm text-muted-foreground">
            © 2024 FGB Acumen. All rights reserved.
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
