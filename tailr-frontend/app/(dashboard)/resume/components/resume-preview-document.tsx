"use client";

import * as React from "react";
import { ResumeData } from "@/shared/types/resume";
import { Globe, Mail, Phone, MapPin, Code2, Link2 } from "lucide-react";
import { useSettings } from "@/shared/hooks/use-settings";
import { getResumeFontCss } from "@/shared/utils/resume-font";

interface ResumePreviewDocumentProps {
  resume: ResumeData;
  className?: string;
  fontFamily?: string;
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

  return (
    <div
      id="printable-resume-document"
      style={{ fontFamily: fontCss }}
      className={`bg-white text-neutral-900 p-8 sm:p-12 max-w-4xl mx-auto rounded-xl shadow-lg border border-neutral-200 dark:border-white/10 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:text-black ${className}`}
    >
      {/* 1. Header & Contact Information */}
      <header className="text-center pb-6 border-b border-neutral-300 print:border-black/40 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 print:text-black">
          {basics.name}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-neutral-700 print:text-black">
          {basics.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 print:hidden" />
              {basics.location}
            </span>
          )}
          {basics.email && (
            <>
              <span className="text-neutral-400 print:text-black">•</span>
              <a
                href={`mailto:${basics.email}`}
                className="hover:underline flex items-center gap-1 text-neutral-800 print:text-black font-medium"
              >
                <Mail className="h-3 w-3 print:hidden" />
                {basics.email}
              </a>
            </>
          )}
          {basics.phone && (
            <>
              <span className="text-neutral-400 print:text-black">•</span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 print:hidden" />
                {basics.phone}
              </span>
            </>
          )}
        </div>

        {/* Web Profiles */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-neutral-600 print:text-black pt-0.5">
          {basics.linkedin && (
            <a
              href={basics.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <Link2 className="h-3 w-3 print:hidden" />
              {basics.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          )}
          {basics.github && (
            <>
              <span className="text-neutral-400 print:text-black">•</span>
              <a
                href={basics.github}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <Code2 className="h-3 w-3 print:hidden" />
                {basics.github.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </>
          )}
          {basics.portfolio && (
            <>
              <span className="text-neutral-400 print:text-black">•</span>
              <a
                href={basics.portfolio}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 font-semibold text-indigo-700 print:text-black"
              >
                <Globe className="h-3 w-3 print:hidden" />
                {basics.portfolio.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </>
          )}
        </div>
      </header>

      {/* 2. Professional Summary */}
      {summary && (
        <section className="pt-5 space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-200 print:border-black/30 pb-1">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-neutral-800 print:text-black text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* 3. Technical Skills Matrix */}
      {skills && (
        <section className="pt-5 space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-200 print:border-black/30 pb-1">
            Technical Skills & Competencies
          </h2>
          <div className="text-xs space-y-1 text-neutral-800 print:text-black">
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
        <section className="pt-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-200 print:border-black/30 pb-1">
            Work Experience
          </h2>

          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-xs text-neutral-950 print:text-black">
                      {exp.title}
                    </span>
                    <span className="text-neutral-500 print:text-black"> — </span>
                    <span className="font-semibold text-xs text-neutral-800 print:text-black">
                      {exp.company}
                    </span>
                    {exp.location && (
                      <span className="text-[11px] text-neutral-500 print:text-black italic ml-1">
                        ({exp.location})
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-600 print:text-black">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>

                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-800 print:text-black">
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
        <section className="pt-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-200 print:border-black/30 pb-1">
            Key Projects & Open Source
          </h2>

          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-xs text-neutral-950 print:text-black">
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
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-700 print:text-black hover:underline"
                    >
                      {proj.link.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  )}
                </div>

                <p className="text-xs text-neutral-700 print:text-black italic">
                  {proj.description}
                </p>

                {proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-neutral-800 print:text-black pt-0.5">
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
        <section className="pt-5 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-200 print:border-black/30 pb-1">
            Education
          </h2>

          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-xs text-neutral-950 print:text-black">
                      {edu.degree} in {edu.fieldOfStudy}
                    </span>
                    <span className="text-neutral-500 print:text-black"> — </span>
                    <span className="font-semibold text-xs text-neutral-800 print:text-black">
                      {edu.institution}
                    </span>
                    {edu.gpa && (
                      <span className="text-[11px] text-neutral-500 print:text-black ml-1">
                        (GPA: {edu.gpa})
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-600 print:text-black">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>

                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-neutral-700 print:text-black">
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
        <section className="pt-5 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 print:text-black border-b border-neutral-200 print:border-black/30 pb-1">
            Certifications & Honors
          </h2>

          <div className="text-xs space-y-1 text-neutral-800 print:text-black">
            {certifications.map((c) => (
              <div key={c.id} className="flex items-baseline justify-between">
                <span>
                  <strong className="font-semibold text-neutral-950 print:text-black">
                    {c.name}
                  </strong>{" "}
                  — {c.issuer}
                </span>
                <span className="text-[11px] font-mono text-neutral-500 print:text-black">
                  {c.date}
                </span>
              </div>
            ))}

            {achievements.map((a) => (
              <div key={a.id} className="flex items-baseline justify-between pt-0.5">
                <span>
                  <strong className="font-semibold text-neutral-950 print:text-black">
                    {a.title}:
                  </strong>{" "}
                  {a.description}
                </span>
                {a.date && (
                  <span className="text-[11px] font-mono text-neutral-500 print:text-black">
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
