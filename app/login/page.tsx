"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { loginSchema, LoginValues } from "@/features/auth/schemas/login.schema";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Login data:", data);
    setIsLoading(false);
  };

  return (
    <AuthCard>
      <AuthHeader title="Welcome back" subtitle="Log in to your account" />
      
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
              Remember me
            </label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
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
