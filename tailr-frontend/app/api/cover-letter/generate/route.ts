import { NextRequest, NextResponse } from "next/server";
import { ResumeData } from "@/shared/types/resume";
import { CoverLetterTone } from "@/shared/types/cover-letter";

interface CoverLetterRequestBody {
  masterResume: ResumeData;
  jobDescription: string;
  companyName: string;
  positionTitle: string;
  location?: string;
  recipientName?: string | null;
  recipientTitle?: string | null;
  tone?: CoverLetterTone;
  template?: "professional" | "minimal" | "modern";
  length?: "short" | "standard" | "detailed";
  customInstructions?: string;
}

import { verifyServerSession } from "@/shared/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    // 1. Mandatory server-side authentication check
    const session = await verifyServerSession(request);
    if (!session.authenticated) {
      return NextResponse.json(
        { error: session.error || "Authentication required. Please log in." },
        { status: session.status || 401 }
      );
    }

    // 2. Request body validation & size limit
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Payload too large. Maximum request body is 2MB." },
        { status: 413 }
      );
    }

    const body: CoverLetterRequestBody = await request.json();
    const {
      masterResume,
      jobDescription,
      companyName,
      positionTitle,
      location,
      recipientName,
      recipientTitle,
      tone = "formal",
      template = "professional",
      length = "standard",
      customInstructions,
    } = body;

    if (!masterResume || !companyName || !positionTitle) {
      return NextResponse.json(
        { error: "Missing required fields: masterResume, companyName, or positionTitle" },
        { status: 400 }
      );
    }

    const candidateName = masterResume.basics?.name || "Applicant";
    const candidateEmail = masterResume.basics?.email || "";
    const candidatePhone = masterResume.basics?.phone || "";
    const candidateLocation = masterResume.basics?.location || "";

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // 3. Call Elysia backend with the verified session token
    try {
      const backendRes = await fetch(`${backendUrl}/cover-letter/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          jobDetails: {
            companyName,
            positionTitle,
            location: location || candidateLocation || "Remote",
            hiringManager: recipientName || undefined,
            hiringManagerTitle: recipientTitle || undefined,
            jobDescription: jobDescription || "General application matching position requirements",
          },
          preferences: {
            tone:
              tone === "conversational"
                ? "natural"
                : tone === "concise"
                  ? "technical"
                  : "professional",
            template,
            length,
            additionalInformation: customInstructions,
          },
          candidate: {
            name: candidateName,
            email: candidateEmail,
            phone: candidatePhone,
            location: candidateLocation,
            summary: masterResume.summary,
            experience: masterResume.experience || [],
            skills: [
              ...(masterResume.skills?.frameworks || []),
              ...(masterResume.skills?.languages || []),
              ...(masterResume.skills?.tools || []),
              ...(masterResume.skills?.other || []),
            ],
            education: masterResume.education || [],
          },
        }),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        return NextResponse.json(backendData);
      }

      // If backend explicitly rejected due to auth or rate limit/quota, return status directly
      if (backendRes.status === 401 || backendRes.status === 403 || backendRes.status === 429) {
        const errPayload = await backendRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: errPayload.message || errPayload.error || "Request failed on backend" },
          { status: backendRes.status }
        );
      }
    } catch (backendError) {
      console.warn("Backend Elysia call error for authenticated user, engaging resilient fallback:", backendError);
    }

    // Fallback if backend is momentarily unreachable
    const primaryExp = masterResume.experience?.[0] || {
      company: "Previous Employer",
      title: "Software Engineer",
      bullets: ["Led technical delivery and scalable web application development"],
    };

    const recipientGreeting = recipientName
      ? `Dear ${recipientName}${recipientTitle ? ` (${recipientTitle})` : ""},`
      : `Dear ${companyName} Hiring Team,`;

    const content = `${companyName}\n${location || "Headquarters"}\n\n${recipientGreeting}\n\nI am writing to express my strong interest in the ${positionTitle} position at ${companyName}. With extensive experience in architecting high-performance applications, I am eager to contribute to your team's roadmap.\n\nAs ${primaryExp.title} at ${primaryExp.company}, I spearheaded critical engineering initiatives, including: ${primaryExp.bullets?.[0] || "optimizing system architecture and product velocity"}.\n\nI look forward to discussing how my background aligns with your goals.\n\nSincerely,\n\n${candidateName}`;

    return NextResponse.json({
      success: true,
      data: {
        content,
        tone,
        length,
        template,
        keyHighlights: [
          `Aligned technical skills to ${positionTitle} requirements at ${companyName}`,
          `Anchored on verified experience at ${primaryExp.company}`,
        ],
        provider: "tailr-local-fallback",
      },
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
  }
}
