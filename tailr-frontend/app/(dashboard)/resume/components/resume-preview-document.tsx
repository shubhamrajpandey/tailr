"use client";

import * as React from "react";
import { ResumeData } from "@/shared/types/resume";
import { useSettings } from "@/shared/hooks/use-settings";
import { getResumeFontCss } from "@/shared/utils/resume-font";

interface ResumePreviewDocumentProps {
  resume: ResumeData;
  className?: string;
  fontFamily?: string;
}

function formatExternalUrl(url?: string): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function ResumePreviewDocument({
  resume,
  className = "",
  fontFamily,
}: ResumePreviewDocumentProps) {
  const { settings } = useSettings();
  const activeFont = fontFamily || settings.resume.fontFamily || "times_new_roman";
  const fontCss = getResumeFontCss(activeFont);

  const { basics, summary, experience, skills, projects, education, certifications, achievements } =
    resume;

  // Build unified single-line contact items
  const contactItems: React.ReactNode[] = [];
  if (basics.location) {
    contactItems.push(<span key="loc">{basics.location}</span>);
  }
  if (basics.phone) {
    contactItems.push(
      <a
        key="phone"
        href={`tel:${basics.phone.replace(/[^\d+]/g, "")}`}
        className="hover:underline text-inherit"
      >
        {basics.phone}
      </a>
    );
  }
  if (basics.email) {
    contactItems.push(
      <a
        key="email"
        href={`mailto:${basics.email}`}
        className="hover:underline text-inherit font-medium"
      >
        {basics.email}
      </a>
    );
  }
  if (basics.linkedin) {
    contactItems.push(
      <a
        key="linkedin"
        href={formatExternalUrl(basics.linkedin)}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-neutral-900 print:text-black font-medium"
      >
        LinkedIn
      </a>
    );
  }
  if (basics.github) {
    contactItems.push(
      <a
        key="github"
        href={formatExternalUrl(basics.github)}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-neutral-900 print:text-black font-medium"
      >
        GitHub
      </a>
    );
  }
  if (basics.portfolio) {
    contactItems.push(
      <a
        key="portfolio"
        href={formatExternalUrl(basics.portfolio)}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-neutral-900 print:text-black font-medium"
      >
        Portfolio
      </a>
    );
  }

  return (
    <div
      id="printable-resume-document"
      style={{ fontFamily: fontCss }}
      className={`bg-white text-neutral-900 p-8 sm:p-10 max-w-4xl mx-auto rounded-xl shadow-lg border border-neutral-200 dark:border-white/10 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:text-black ${className}`}
    >
      {/* 1. Header & Contact Information (Clean 1-line, no bottom divider) */}
      <header className="text-center pb-3 space-y-1.5">
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-neutral-950 print:text-black leading-tight">
          {basics.name}
        </h1>

        {contactItems.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-neutral-800 print:text-black pt-0.5">
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span className="text-neutral-400 print:text-neutral-600 select-none">•</span>
                )}
                {item}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* 2. Professional Summary */}
      {summary && (
        <section className="pt-3.5 sm:pt-4 space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-900 print:border-black pb-0.5">
            Professional Summary
          </h2>
          <p className="text-[11.5px] sm:text-xs leading-relaxed text-neutral-800 print:text-black text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* 3. Technical Skills Matrix */}
      {skills && (
        <section className="pt-3.5 sm:pt-4 space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-900 print:border-black pb-0.5">
            Technical Skills & Competencies
          </h2>
          <div className="text-[11.5px] sm:text-xs space-y-1 text-neutral-800 print:text-black leading-normal">
            {skills.languages.length > 0 && (
              <div>
                <strong className="font-semibold text-neutral-950 print:text-black">
                  Languages:
                </strong>{" "}
                {skills.languages.join(", ")}
              </div>
            )}
            {skills.frameworks.length > 0 && (
              <div>
                <strong className="font-semibold text-neutral-950 print:text-black">
                  Frameworks & Libraries:
                </strong>{" "}
                {skills.frameworks.join(", ")}
              </div>
            )}
            {skills.tools.length > 0 && (
              <div>
                <strong className="font-semibold text-neutral-950 print:text-black">
                  Tools & Platforms:
                </strong>{" "}
                {skills.tools.join(", ")}
              </div>
            )}
            {skills.other.length > 0 && (
              <div>
                <strong className="font-semibold text-neutral-950 print:text-black">
                  Architectures & Concepts:
                </strong>{" "}
                {skills.other.join(", ")}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Work Experience */}
      {experience.length > 0 && (
        <section className="pt-3.5 sm:pt-4 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-900 print:border-black pb-0.5">
            Work Experience
          </h2>

          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-[12.5px] text-neutral-950 print:text-black">
                      {exp.title}
                    </span>
                    <span className="text-neutral-500 print:text-black"> — </span>
                    <span className="font-semibold text-xs sm:text-[12.5px] text-neutral-800 print:text-black">
                      {exp.company}
                    </span>
                    {exp.location && (
                      <span className="text-[11px] text-neutral-500 print:text-black italic ml-1">
                        ({exp.location})
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-600 print:text-black shrink-0 whitespace-nowrap">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>

                <ul className="list-disc list-outside ml-4 space-y-1 text-[11.5px] sm:text-xs text-neutral-800 print:text-black">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Key Projects */}
      {projects.length > 0 && (
        <section className="pt-3.5 sm:pt-4 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-900 print:border-black pb-0.5">
            Key Projects & Open Source
          </h2>

          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-[12.5px] text-neutral-950 print:text-black">
                      {proj.name}
                    </span>
                    {proj.tech.length > 0 && (
                      <span className="text-[11px] font-mono text-neutral-500 print:text-black ml-1.5">
                        [{proj.tech.join(", ")}]
                      </span>
                    )}
                  </div>
                  {proj.link && (
                    <a
                      href={formatExternalUrl(proj.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-neutral-800 print:text-black hover:underline font-medium shrink-0 whitespace-nowrap"
                    >
                      {proj.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>

                {proj.description && (
                  <p className="text-[11.5px] sm:text-xs text-neutral-700 print:text-black italic leading-normal">
                    {proj.description}
                  </p>
                )}

                {proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[11.5px] sm:text-xs text-neutral-800 print:text-black pt-0.5">
                    {proj.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Education */}
      {education.length > 0 && (
        <section className="pt-3.5 sm:pt-4 space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-900 print:border-black pb-0.5">
            Education
          </h2>

          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-[12.5px] text-neutral-950 print:text-black">
                      {edu.degree}
                      {edu.fieldOfStudy &&
                        !edu.degree.toLowerCase().includes(edu.fieldOfStudy.toLowerCase()) && (
                          <> in {edu.fieldOfStudy}</>
                        )}
                    </span>
                    <span className="text-neutral-500 print:text-black"> — </span>
                    <span className="font-semibold text-xs sm:text-[12.5px] text-neutral-800 print:text-black">
                      {edu.institution}
                    </span>
                    {edu.gpa && (
                      <span className="text-[11px] text-neutral-500 print:text-black ml-1">
                        (GPA: {edu.gpa})
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-600 print:text-black shrink-0 whitespace-nowrap">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>

                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11.5px] text-neutral-700 print:text-black">
                    {edu.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Certifications & Honors */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <section className="pt-3.5 sm:pt-4 space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-900 print:border-black pb-0.5">
            Certifications & Honors
          </h2>

          <div className="text-[11.5px] sm:text-xs space-y-1 text-neutral-800 print:text-black leading-normal">
            {certifications.map((c) => (
              <div key={c.id} className="flex items-baseline justify-between gap-2">
                <span>
                  <strong className="font-semibold text-neutral-950 print:text-black">
                    {c.name}
                  </strong>{" "}
                  — {c.issuer}
                </span>
                <span className="text-[11px] font-mono text-neutral-500 print:text-black shrink-0 whitespace-nowrap">
                  {c.date}
                </span>
              </div>
            ))}

            {achievements.map((a) => (
              <div key={a.id} className="flex items-baseline justify-between gap-2 pt-0.5">
                <span>
                  <strong className="font-semibold text-neutral-950 print:text-black">
                    {a.title}:
                  </strong>{" "}
                  {a.description}
                </span>
                {a.date && (
                  <span className="text-[11px] font-mono text-neutral-500 print:text-black shrink-0 whitespace-nowrap">
                    {a.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
