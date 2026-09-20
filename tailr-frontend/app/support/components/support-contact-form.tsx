"use client";

import * as React from "react";
import {
  Send,
  User,
  Mail,
  Paperclip,
  CheckCircle2,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

const CATEGORIES = [
  { value: "ACCOUNT_ACCESS", label: "Account Access & Password Recovery" },
  { value: "AI_TAILORING", label: "AI Resume Tailoring Inquiry" },
  { value: "PDF_EXPORT", label: "ATS Resume PDF Formatting" },
  { value: "TRUTH_CONSTRAINT", label: "Truth-Constraint Clarification" },
  { value: "BILLING", label: "Billing & Workspace Inquiry" },
  { value: "GENERAL_FEEDBACK", label: "General Feedback or Feature Request" },
];

const PRIORITIES = [
  {
    id: "LOW",
    label: "Low",
    desc: "General inquiry",
    activeClass: "bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white border-neutral-300 dark:border-white/20",
  },
  {
    id: "NORMAL",
    label: "Normal",
    desc: "Standard issue",
    activeClass: "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30",
  },
  {
    id: "URGENT",
    label: "Urgent",
    desc: "Interview < 24h",
    activeClass: "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30",
  },
];

interface SupportContactFormProps {
  initialCategory?: string;
}

export function SupportContactForm({ initialCategory }: SupportContactFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [category, setCategory] = React.useState(initialCategory || "ACCOUNT_ACCESS");
  const [priority, setPriority] = React.useState("NORMAL");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [attachments, setAttachments] = React.useState<{ name: string; size: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedTicketId, setSubmittedTicketId] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: { name: string; size: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const sizeMb = (f.size / (1024 * 1024)).toFixed(2);
      newFiles.push({ name: f.name, size: `${sizeMb} MB` });
    }
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `TLR-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTicketId(generatedId);
    }, 700);
  };

  const handleReset = () => {
    setSubmittedTicketId(null);
    setSubject("");
    setMessage("");
    setAttachments([]);
  };

  if (submittedTicketId) {
    return (
      <div className="h-full rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-8 sm:p-10 shadow-sm flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/20 flex items-center justify-center shadow-xs">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2 max-w-md">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
            Ticket #{submittedTicketId}
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white pt-2">
            Inquiry Dispatched to Engineering
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Thank you, <strong>{name}</strong>! We have received your message. Our engineering team will reply directly to <strong className="text-neutral-900 dark:text-white">{email}</strong> within <strong>2 hours</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 w-full max-w-sm text-left text-xs space-y-2 text-neutral-600 dark:text-neutral-300">
          <div className="flex justify-between">
            <span className="text-neutral-400">Category:</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {CATEGORIES.find((c) => c.value === category)?.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Priority:</span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {priority}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Live Status:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Triage In Progress
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            onClick={handleReset}
            variant="secondary"
            className="text-xs font-semibold"
          >
            Submit Another Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="pb-4 border-b border-neutral-200 dark:border-white/[0.06] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
            Send Us a Message
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Fill out the details below. We read every email and reply promptly.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Support Active</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Your Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              icon={<User className="h-4 w-4 text-neutral-400" />}
              className="h-10 text-xs rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="where we can reply to you"
              icon={<Mail className="h-4 w-4 text-neutral-400" />}
              className="h-10 text-xs rounded-xl"
              required
            />
          </div>
        </div>

        {/* Category & Urgency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Topic / Inquiry Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => {
                const isActive = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`h-10 px-2 py-1 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                      isActive
                        ? p.activeClass
                        : "border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Subject Summary <span className="text-rose-500">*</span>
          </label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief overview of the issue"
            className="h-10 text-xs rounded-xl"
            required
          />
        </div>

        {/* Detailed Message */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              How can we assist you? <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-neutral-400">
              {message.length} chars
            </span>
          </div>
          <Textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue, what happened, or how we can help you..."
            className="text-xs leading-relaxed rounded-xl"
            required
          />
        </div>

        {/* File Attachment Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Attachment (Optional)
            </label>
            <span className="text-[11px] text-neutral-400">
              Screenshots or error logs up to 10MB
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.json,.txt"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 rounded-xl border border-dashed border-neutral-300 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/40 bg-neutral-50/50 dark:bg-white/[0.02] flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs text-neutral-600 dark:text-neutral-400"
          >
            <Paperclip className="h-4 w-4 text-neutral-400" />
            <span>Click to attach screenshot or file</span>
          </div>

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200"
                >
                  <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-medium truncate max-w-[160px]">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-indigo-500/70 font-mono">
                    ({file.size})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl font-semibold text-sm bg-neutral-950 hover:bg-neutral-900 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99] gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending Support Request...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Support Inquiry</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
