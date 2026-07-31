"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, dispatch to auth endpoint
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Reset Password</h1>
            <p className="text-sm text-text-secondary">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="bg-success/10 border border-success/20 rounded-lg p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-text-primary mb-2">Check your email</h2>
              <p className="text-sm text-text-secondary mb-6">
                We've sent a password reset link to <span className="font-medium text-text-primary">{email}</span>
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-10 pl-10 pr-3 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-primary text-surface rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Send Reset Link
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
