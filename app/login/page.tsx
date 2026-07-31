"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { loginSchema, LoginValues } from "@/features/auth/schemas/login.schema";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { AuthFooter } from "@/components/auth/AuthFooter";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      await AuthService.login(data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      // Ideally show toast error here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader title="Welcome back" subtitle="Log in to your account" />
      
      {isRegistered && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-md text-sm font-medium text-center">
          Account created successfully. Please log in.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          id="email"
          type="email"
          label="Email address"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register("email")}
          disabled={isLoading}
        />
        
        <div className="space-y-1.5">
          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-border text-primary focus:ring-primary w-4 h-4 bg-background transition-colors cursor-pointer disabled:opacity-50"
                {...register("rememberMe")}
                disabled={isLoading}
              />
              <span className="select-none">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:opacity-80 transition-opacity">
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-9 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log in"}
        </button>
      </form>

      <AuthDivider />
      
      <SocialLoginButton provider="Google" disabled={isLoading} />
      
      <AuthFooter 
        text="Don't have an account?" 
        linkText="Create account" 
        href="/signup" 
      />
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
