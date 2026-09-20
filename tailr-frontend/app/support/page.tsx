"use client";

import * as React from "react";
import { SupportNavbar } from "./components/support-navbar";
import { SupportHero } from "./components/support-hero";
import { SupportChannelsList } from "./components/support-channels-list";
import { SupportContactForm } from "./components/support-contact-form";
import { SupportFaqSection } from "./components/support-faq-section";
import { SupportFooter } from "./components/support-footer";

export default function PublicSupportPage() {
  const [selectedTopic, setSelectedTopic] = React.useState<string>("ACCOUNT_ACCESS");

  const handleSelectTopic = (category: string) => {
    setSelectedTopic(category);
    const formElement = document.getElementById("support-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Top Navbar */}
      <SupportNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <SupportHero onSelectTopic={handleSelectTopic} />

        {/* Two-Column Grid: Channels on Left (~40%), Ticket Form on Right (~60%) */}
        <div id="support-form-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels & Status */}
          <div className="lg:col-span-5">
            <SupportChannelsList />
          </div>

          {/* Right Column: Interactive Support Ticket Form */}
          <div className="lg:col-span-7">
            <SupportContactForm key={selectedTopic} initialCategory={selectedTopic} />
          </div>
        </div>

        {/* FAQs Section */}
        <SupportFaqSection />
      </main>

      {/* Public Footer */}
      <SupportFooter />
    </div>
  );
}
