"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { signupSchema, SignupValues } from "@/features/auth/schemas/signup.schema";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  
  const { register, handleSubmit, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      organizationName: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupValues) => {
    setIsLoading(true);
    try {
      await AuthService.signup(data);
      // Auto-login after signup
      await AuthService.login({ email: data.email, password: data.password });
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup failed", error);
      alert(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader title="Create your account" subtitle="Join thousands of teams" />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          id="organizationName"
          label="Organization Name"
          placeholder="Acme Inc."
          error={errors.organizationName?.message}
          {...register("organizationName")}
          disabled={isLoading}
        />

        <AuthInput
          id="fullName"
          label="Full Name"
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register("fullName")}
          disabled={isLoading}
        />

        <AuthInput
          id="email"
          type="email"
          label="Email address"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register("email")}
          disabled={isLoading}
        />
        
        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
          disabled={isLoading}
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
          disabled={isLoading}
        />

        <div className="pt-1">
          <label className="flex items-start gap-2 text-sm text-text-secondary cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 rounded border-border text-primary focus:ring-primary w-4 h-4 bg-background transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              {...register("acceptTerms")}
              disabled={isLoading}
            />
            <span className="leading-snug">
              I agree to the <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>
            </span>
          </label>
          {errors.acceptTerms?.message && (
             <p className="text-xs text-danger mt-1">{errors.acceptTerms.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-9 bg-primary text-surface rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
        </button>
      </form>

      <AuthDivider />
      
      <SocialLoginButton provider="Google" disabled={isLoading} />
      
      <AuthFooter 
        text="Already have an account?" 
        linkText="Log in" 
        href="/login" 
      />
    </AuthCard>
  );
}
