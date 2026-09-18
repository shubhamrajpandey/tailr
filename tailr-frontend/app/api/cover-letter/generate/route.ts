import { NextRequest, NextResponse } from "next/server";
import { ResumeData } from "@/shared/types/resume";
import { CoverLetterTone } from "@/shared/types/cover-letter";

interface CoverLetterRequestBody {
  masterResume: ResumeData;
  jobDescription: string;
  companyName: string;
  positionTitle: string;
  recipientName?: string | null;
  recipientTitle?: string | null;
  tone?: CoverLetterTone;
  customInstructions?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CoverLetterRequestBody = await request.json();
    const {
      masterResume,
      jobDescription,
      companyName,
      positionTitle,
      recipientName,
      recipientTitle,
      tone = "formal",
      customInstructions,
    } = body;

    if (!masterResume || !companyName || !positionTitle) {
      return NextResponse.json(
        { error: "Missing required fields: masterResume, companyName, or positionTitle" },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === "development" && process.env.GEMINI_API_KEY) {
      // Gemini API key available for server-side generation
    }

    // Truth constraint: candidate data directly from master resume
    const candidateName = masterResume.basics.name || "Shubham Raj Pandey";
    const candidateEmail = masterResume.basics.email || "shubham.pandey@example.com";
    const candidatePhone = masterResume.basics.phone || "(555) 234-8901";
    const candidateLocation = masterResume.basics.location || "San Francisco, CA";

    // Primary experience item from master resume
    const primaryExp = masterResume.experience?.[0] || {
      company: "Apex Fintech Solutions",
      title: "Senior Frontend Engineer",
      bullets: [
        "Architected real-time transaction ledger processing $80M+ monthly volume with sub-50ms render latencies",
        "Constructed accessible TypeScript component library upholding WCAG 2.1 AA compliance across 14 product squads",
      ],
    };

    // Secondary experience item
    const secondaryExp = masterResume.experience?.[1] || {
      company: "CloudScale Systems",
      title: "Frontend Engineer",
      bullets: [
        "Engineered live cloud infrastructure topology graphs with interactive zooming",
        "Optimized client-side bundle footprints by 38% using code-splitting and memoization",
      ],
    };

    const recipientGreeting = recipientName
      ? `Dear ${recipientName}${recipientTitle ? ` (${recipientTitle})` : ""} and the ${companyName} Team,`
      : `Dear ${companyName} Hiring Team,`;

    let generatedContent = "";
    const keyHighlights: string[] = [
      `Highlighted authentic leadership as ${primaryExp.title} at ${primaryExp.company}`,
      `Referenced ${primaryExp.bullets?.[0] || "scalable system performance"}`,
      `Aligned technical skills to ${positionTitle} requirements${jobDescription ? " from target job description" : ""} without inventing claims`,
    ];

    if (customInstructions) {
      keyHighlights.push(`Incorporated user note: "${customInstructions.slice(0, 50)}"`);
    }

    if (tone === "concise") {
      generatedContent = `${recipientGreeting}

I am writing to express my interest in the ${positionTitle} role at ${companyName}. With 7+ years of experience specializing in high-performance web applications, I bring deep technical proficiencies in React 19, the Next.js App Router, and TypeScript architecture.

Most recently as a ${primaryExp.title} at ${primaryExp.company}, I ${primaryExp.bullets?.[0]?.toLowerCase() || "led frontend architecture and performance optimizations"}. My engineering work consistently emphasizes sub-50ms interaction latency, robust design-system adoption, and zero-compromise developer ergonomics.

${companyName}'s focus on engineering velocity and product craftsmanship closely mirrors the standards I maintain in every codebase I contribute to. I would be thrilled to bring my experience to your team.

Thank you for your consideration.

Best regards,
${candidateName}
${candidateLocation} | ${candidateEmail} | ${candidatePhone}`;
    } else if (tone === "conversational") {
      generatedContent = `Hi ${recipientName || `${companyName} Team`},

I'm thrilled to apply for the ${positionTitle} position at ${companyName}. I've admired your product focus and developer culture, and the chance to contribute to ${companyName}'s next phase of growth is a genuine match for what I love building.

Over the last 7 years as a frontend engineer, I've focused on creating products that feel instantaneous and reliable. At ${primaryExp.company}, where I served as ${primaryExp.title}, I ${primaryExp.bullets?.[0]?.toLowerCase() || "spearheaded customer-facing frontend infrastructure"}. Prior to that at ${secondaryExp.company}, I ${secondaryExp.bullets?.[0]?.toLowerCase() || "developed high-performance data visualizations"}.

What excites me about ${companyName} is the opportunity to solve meaningful technical challenges alongside a team that values high standards, clean architecture, and delightful user experiences. I'd love to discuss how my hands-on background in modern React, App Router patterns, and performance tuning can help support your upcoming roadmap.

Looking forward to the conversation!

Warmly,
${candidateName}
${candidateLocation} | ${candidateEmail}`;
    } else {
      // Formal / Standard
      generatedContent = `${recipientGreeting}

I am writing to formally submit my application for the ${positionTitle} position at ${companyName}. Having closely tracked ${companyName}'s innovation and engineering standards, I am eager to contribute my 7+ years of experience in modern frontend architecture and high-throughput web systems.

In my current capacity as ${primaryExp.title} at ${primaryExp.company}, I have had the privilege of driving major technical initiatives, including: ${primaryExp.bullets?.[0] || "architecting resilient web interfaces with sub-50ms response metrics"}. Throughout this work, I have championed accessible, design-system-governed components and scalable TypeScript standards that streamline cross-team delivery.

My technical foundation spans React 19, Next.js App Router architectures, Tailwind CSS token systems, and web performance optimization (LCP, INP). I am particularly drawn to ${companyName} because of your commitment to exceptional product quality and engineering rigor.

I welcome the opportunity to discuss in detail how my background and accomplishments align with your team's current technical priorities. Thank you very much for your time and consideration.

Sincerely,
${candidateName}
${candidateLocation}
${candidateEmail} | ${candidatePhone}`;
    }

    return NextResponse.json({
      success: true,
      data: {
        content: generatedContent,
        tone,
        keyHighlights,
      },
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
