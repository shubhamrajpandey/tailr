"use client";

import * as React from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useMasterResume } from "@/shared/hooks/use-master-resume";

const DEFAULT_WEBHOOK_URL =
  "https://thatpandey.app.n8n.cloud/webhook-test/job-application";

const SAMPLE_JD = `About the Role:
We are looking for a Senior Frontend Engineer to build the next generation of our customer-facing web platform. You will design, build, and optimize high-scale web applications using React, Next.js, and TypeScript.

Key Responsibilities:
- Architect and develop modern, responsive UI interfaces with sub-100ms interaction latencies.
- Collaborate with designers, backend engineers, and product managers to deliver delighting user experiences.
- Build and maintain our design system components with accessibility (WCAG AA) in mind.
- Write robust unit, integration, and end-to-end tests to ensure platform resilience.

Requirements:
- 5+ years of production experience with TypeScript, React, and modern CSS.
- Proven experience with Next.js (App Router), server-side rendering, and performance optimization.
- Familiarity with REST/GraphQL APIs and asynchronous state management.
- Strong understanding of web fundamentals, accessibility, and Core Web Vitals.
- Excellent communication and collaboration skills in an agile team.`;

interface WebhookResponseState {
  success: boolean;
  status: number;
  statusText?: string;
  durationMs: number;
  data: unknown;
  help?: string;
  isTestWebhook?: boolean;
  isNotListening?: boolean;
}

export default function N8nAutomationPage() {
  const { masterResume, isLoaded } = useMasterResume();

  // Form State
  const [webhookUrl, setWebhookUrl] = React.useState(DEFAULT_WEBHOOK_URL);
  const [company, setCompany] = React.useState("Vercel");
  const [position, setPosition] = React.useState("Senior Frontend Engineer");
  const [jobDescription, setJobDescription] = React.useState("");
  const [includeMasterResume, setIncludeMasterResume] = React.useState(true);
  const [customNotes, setCustomNotes] = React.useState("");

  // Execution State
  const [isLoading, setIsLoading] = React.useState(false);
  const [responseState, setResponseState] =
    React.useState<WebhookResponseState | null>(null);
  const [hasCopied, setHasCopied] = React.useState(false);

  // Compute live payload to show exactly what n8n receives
  const livePayload = React.useMemo(() => {
    return {
      event: "job_application_tailoring_request",
      company: company.trim() || "Target Company",
      position: position.trim() || "Role",
      jobDescription: jobDescription.trim(),
      submittedAt: new Date().toISOString(),
      customNotes: customNotes.trim() || undefined,
      applicant: isLoaded
        ? {
            name: masterResume.basics.name,
            email: masterResume.basics.email,
            phone: masterResume.basics.phone,
            location: masterResume.basics.location,
            linkedin: masterResume.basics.linkedin,
            github: masterResume.basics.github,
            portfolio: masterResume.basics.portfolio,
          }
        : null,
      masterResume: includeMasterResume && isLoaded ? masterResume : null,
    };
  }, [
    company,
    position,
    jobDescription,
    customNotes,
    includeMasterResume,
    isLoaded,
    masterResume,
  ]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(livePayload, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setCompany("Vercel");
    setPosition("Senior Frontend Engineer");
    setJobDescription(SAMPLE_JD);
  };

  const toggleUrlMode = () => {
    if (webhookUrl.includes("webhook-test")) {
      setWebhookUrl(webhookUrl.replace("webhook-test", "webhook"));
    } else if (webhookUrl.includes("/webhook/")) {
      setWebhookUrl(webhookUrl.replace("/webhook/", "/webhook-test/"));
    }
  };

  const handleTriggerWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      alert("Please paste a Job Description before sending.");
      return;
    }

    setIsLoading(true);
    setResponseState(null);

    try {
      const res = await fetch("/api/n8n/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          payload: livePayload,
        }),
      });

      const data = await res.json();
      setResponseState(data);
    } catch (err: unknown) {
      setResponseState({
        success: false,
        status: 500,
        statusText: "Client Request Failed",
        durationMs: 0,
        data: err instanceof Error ? err.message : "Failed to contact proxy",
        help: "Check your local server or network connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header Bar */}
        <header className="px-8 pt-7 pb-6 flex flex-col gap-3 border-b border-neutral-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c0d10]/70 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            <Link
              href="/dashboard"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Overview
            </Link>
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-bold">
              n8n Automation Bridge
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <Zap className="h-6 w-6" />
                </span>
                n8n Automation Dispatcher
                <Badge
                  variant="outline"
                  className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-xs font-mono"
                >
                  Webhook POST
                </Badge>
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                Dispatch job descriptions and your master resume directly into your n8n workflow for AI analysis, tailoring, and notifications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/resume/tailor">
                <Button variant="secondary" size="sm" className="gap-1.5 font-semibold text-xs">
                  <Layers className="h-3.5 w-3.5" />
                  Local AI Tailor
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 px-8 py-8 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleTriggerWebhook} className="space-y-6">
                {/* 1. Webhook Destination Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span>1. Target n8n Webhook</span>
                      </CardTitle>
                      <button
                        type="button"
                        onClick={toggleUrlMode}
                        className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        Switch to {webhookUrl.includes("webhook-test") ? "Production" : "Test"} URL
                      </button>
                    </div>
                    <CardDescription className="text-xs">
                      The HTTP POST endpoint in your n8n workflow.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="relative">
                      <Input
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://.../webhook-test/job-application"
                        className="font-mono text-xs pr-24 bg-neutral-50 dark:bg-black/40"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {webhookUrl.includes("webhook-test") ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            TEST MODE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            PRODUCTION
                          </span>
                        )}
                      </div>
                    </div>
                    {webhookUrl.includes("webhook-test") && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          In n8n, make sure you clicked <strong>&quot;Listen for test event&quot;</strong> before clicking send!
                        </span>
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* 2. Target Company & Role */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      2. Role & Company Details
                    </CardTitle>
                    <CardDescription className="text-xs">
                      These variables are passed to n8n to identify the application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Company Name
                      </label>
                      <Input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. OpenAI, Stripe, Google"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Position Title
                      </label>
                      <Input
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Job Description Textarea */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span>3. Job Description</span>
                        <span className="text-xs font-normal text-neutral-400">
                          ({jobDescription.length} chars)
                        </span>
                      </CardTitle>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleLoadSample}
                        className="text-xs gap-1.5 h-7 px-2.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                      >
                        <Sparkles className="h-3 w-3" />
                        Load Sample JD
                      </Button>
                    </div>
                    <CardDescription className="text-xs">
                      Paste the requirements, qualifications, and role description.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      className="min-h-[220px] font-mono text-xs leading-relaxed"
                      required
                    />
                  </CardContent>
                </Card>

                {/* 4. Master Resume Attachment Option */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="include-resume"
                            className="text-sm font-bold text-neutral-900 dark:text-white cursor-pointer"
                          >
                            Include Master Resume in Webhook
                          </label>
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                          >
                            Recommended for n8n AI
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Attaches your full work experience, skills, and projects so n8n can compare and tailor.
                        </p>
                        {isLoaded && includeMasterResume && (
                          <div className="pt-2 text-xs text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                            <span className="font-semibold text-neutral-900 dark:text-white">
                              {masterResume.basics.name}
                            </span>
                            <span>•</span>
                            <span>{masterResume.experience.length} experiences</span>
                            <span>•</span>
                            <span>
                              {masterResume.skills.languages.length +
                                masterResume.skills.frameworks.length}{" "}
                              skills
                            </span>
                          </div>
                        )}
                      </div>

                      <input
                        id="include-resume"
                        type="checkbox"
                        checked={includeMasterResume}
                        onChange={(e) => setIncludeMasterResume(e.target.checked)}
                        className="h-5 w-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Trigger Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !jobDescription.trim()}
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-orange-500/20 transition-all gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RotateCcw className="h-5 w-5 animate-spin" />
                        Posting to n8n Webhook...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send POST to n8n Webhook
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Response & Debug Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Webhook Response Card */}
              <Card className="border-neutral-200 dark:border-white/10 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b border-neutral-100 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      Execution Status
                    </CardTitle>
                    {responseState && (
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            responseState.success
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {responseState.status} {responseState.statusText || ""}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {responseState.durationMs}ms
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {!responseState && !isLoading && (
                    <div className="py-12 px-4 text-center space-y-3">
                      <div className="h-10 w-10 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <Send className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                        Ready to trigger
                      </p>
                      <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                        Paste a job description and click &quot;Send POST to n8n Webhook&quot; to test your pipeline.
                      </p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="py-12 px-4 text-center space-y-3">
                      <RotateCcw className="h-8 w-8 mx-auto animate-spin text-orange-500" />
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        Sending payload to n8n...
                      </p>
                      <p className="text-xs text-neutral-400">
                        Waiting for response from {webhookUrl}
                      </p>
                    </div>
                  )}

                  {responseState && (
                    <div className="space-y-3">
                      {responseState.success ? (
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-semibold block mb-0.5">
                              Workflow Received Request Successfully!
                            </strong>
                            n8n accepted the payload. Check your n8n workflow canvas to inspect the execution and downstream nodes.
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold block">
                                n8n returned Status {responseState.status}
                              </strong>
                              {responseState.help && (
                                <p className="mt-1 text-rose-700 dark:text-rose-300 font-medium">
                                  {responseState.help}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                          Response Body from n8n:
                        </span>
                        <pre className="p-3 rounded-lg bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto max-h-60 border border-neutral-800">
                          {typeof responseState.data === "object"
                            ? JSON.stringify(responseState.data, null, 2)
                            : String(responseState.data)}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Payload Preview */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-indigo-500" />
                      Payload Preview (Sent to n8n)
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPayload}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      {hasCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy JSON
                        </>
                      )}
                    </Button>
                  </div>
                  <CardDescription className="text-xs">
                    This is the exact JSON structure that n8n receives in `json.body`.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="p-3 rounded-lg bg-neutral-950 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[320px] border border-neutral-800">
                    {JSON.stringify(livePayload, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Quick Guide Card */}
              <Card className="bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20 border-indigo-200/60 dark:border-indigo-500/20">
                <CardContent className="p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    How your n8n workflow uses this:
                  </h4>
                  <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400 pl-4 list-disc">
                    <li>
                      <strong>Webhook Node:</strong> Method = POST, Path = <code className="font-mono bg-white dark:bg-black/30 px-1 rounded">job-application</code>
                    </li>
                    <li>
                      <strong>AI Agent Node:</strong> Reference <code className="font-mono text-indigo-600 dark:text-indigo-400">&#123;&#123; $json.body.jobDescription &#125;&#125;</code> and compare against <code className="font-mono text-indigo-600 dark:text-indigo-400">&#123;&#123; $json.body.masterResume &#125;&#125;</code>.
                    </li>
                    <li>
                      <strong>Notification Node:</strong> Send results to applicant at <code className="font-mono text-indigo-600 dark:text-indigo-400">&#123;&#123; $json.body.applicant.email &#125;&#125;</code> or Slack/Telegram.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
