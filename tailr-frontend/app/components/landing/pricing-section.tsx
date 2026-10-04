"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter",
      description: "Ideal for active applicants exploring new opportunities.",
      price: "$0",
      period: "forever",
      cta: "Get Started Free",
      href: "/register",
      popular: false,
      features: [
        "3 tailored resumes per month",
        "Master Resume central architecture",
        "Standard ATS-compliant PDF export",
        "Basic application Kanban board",
        "Community support",
      ],
    },
    {
      name: "Pro Career",
      description: "For professionals seeking maximum interview callback velocity.",
      price: billingCycle === "annual" ? "$15" : "$19",
      period: "per month",
      subtext: billingCycle === "annual" ? "billed annually ($180/yr)" : "billed monthly",
      cta: "Start 7-Day Free Trial",
      href: "/register?plan=pro",
      popular: true,
      features: [
        "Unlimited AI tailored resume generations",
        "Powered by Gemini 2.5 Flash & Pro",
        "Side-by-side Diff & Transparency Inspector",
        "AI Cover Letter generator",
        "Recruiter response velocity analytics",
        "Priority background rendering queue",
        "Export in standard & compact PDF templates",
      ],
    },
    {
      name: "Founder Lifetime",
      description: "One-time investment for life. Zero recurring subscriptions.",
      price: "$149",
      period: "one-time",
      subtext: "lifetime access & all future updates",
      cta: "Claim Lifetime Access",
      href: "/register?plan=founder",
      popular: false,
      features: [
        "All Pro Career features included forever",
        "Zero subscription fees ever",
        "All future AI model upgrades included",
        "Early access to automated outreach & n8n sync",
        "Private VIP Discord community",
        "Direct founder support channel",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-14 sm:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Transparent Pricing
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Invest in Your Career Trajectory
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            One extra interview callback pays for a lifetime of Tailr. Pick the plan that matches your career ambitions.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-6 sm:mt-8 inline-flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-semibold max-w-full">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-3 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer text-xs",
                billingCycle === "monthly"
                  ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={cn(
                "px-3 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs",
                billingCycle === "annual"
                  ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-2xl p-5 sm:p-8 flex flex-col justify-between transition-all duration-200 relative",
                plan.popular
                  ? "border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-[#0e0f14] shadow-xl shadow-indigo-500/10 md:scale-[1.02] z-10"
                  : "border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0d10] shadow-xs hover:border-neutral-300 dark:hover:border-white/20"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] sm:text-[11px] font-bold tracking-wide uppercase shadow-xs flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <Sparkles className="h-3 w-3" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-neutral-950 dark:text-white font-sans">
                    {plan.name}
                  </h3>
                </div>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    /{plan.period}
                  </span>
                </div>
                {plan.subtext && (
                  <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                    {plan.subtext}
                  </p>
                )}

                <div className="mt-8 space-y-3 pt-6 border-t border-neutral-100 dark:border-white/5">
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
                    Included Capabilities
                  </div>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link href={plan.href} className="w-full block">
                  <Button
                    variant={plan.popular ? "primary" : "secondary"}
                    size="default"
                    className={cn(
                      "w-full text-xs font-bold gap-2",
                      plan.popular && "shadow-md shadow-indigo-500/25"
                    )}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
