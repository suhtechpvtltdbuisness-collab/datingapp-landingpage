"use client";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { AlertCircle, ChevronDown, Headphones, Paperclip, Send, X } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { EASE } from "../theme";

const issueTypes = ["Account access", "Profile or photos", "Messaging", "Payments", "Safety concern", "Bug or performance"];
const priorities = ["Low", "Medium", "High", "Urgent"];

export default function ReportProblemSection() {
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const { ref, visible } = useScrollReveal<HTMLFormElement>();
  const remaining = useMemo(() => 500 - description.length, [description.length]);

  return (
    <section id="report-problem" aria-labelledby="report-problem-title" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-card bg-white text-brand-magenta shadow-card">
              <Headphones className="h-7 w-7" aria-hidden />
            </span>
            <SectionHeading
              id="report-problem-title"
              eyebrow="Support"
              title="Report a problem"
              subtitle="Tell us what's not working. Add the right details so our safety team can help faster."
            />
          </div>
          <div className="rounded-full border border-brand-magenta/15 bg-white px-4 py-2 text-sm font-semibold text-brand-ink-soft shadow-card">
            Usually reviewed within 24 hours
          </div>
        </div>

        <motion.form
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-10 overflow-hidden rounded-card border border-brand-magenta/10 bg-white shadow-card"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="border-b border-brand-magenta/10 bg-brand-gradient-soft px-6 py-5 sm:px-8">
            <h3 className="font-display text-2xl font-extrabold text-brand-ink">Tell us about the issue</h3>
            <p className="mt-1 text-sm text-brand-ink-soft">Please provide as much detail as possible.</p>
          </div>

          <div className="grid gap-6 p-6 sm:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <FieldLabel label="Issue type" required>
                <SelectField name="issueType" placeholder="Select issue type" options={issueTypes} />
              </FieldLabel>
              <FieldLabel label="Priority" required>
                <SelectField name="priority" placeholder="Select priority" options={priorities} />
              </FieldLabel>
            </div>

            <FieldLabel label="Subject" required>
              <input
                name="subject"
                type="text"
                placeholder="Briefly describe the problem"
                className="h-14 w-full rounded-2xl border border-brand-magenta/15 bg-white px-4 text-brand-ink outline-none transition focus:border-brand-magenta focus:ring-4 focus:ring-brand-magenta/15"
              />
            </FieldLabel>

            <FieldLabel label="Description" required>
              <textarea
                name="description"
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add detailed information about the issue..."
                className="min-h-44 w-full resize-y rounded-2xl border border-brand-magenta/15 bg-white px-4 py-4 text-brand-ink outline-none transition focus:border-brand-magenta focus:ring-4 focus:ring-brand-magenta/15"
              />
              <span className="mt-2 block text-right text-sm text-brand-ink-soft">{remaining}/500</span>
            </FieldLabel>

            <FieldLabel label="Attach file" optional>
              <label className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-dashed border-brand-magenta/25 bg-brand-bg/50 p-5 transition hover:border-brand-magenta hover:bg-brand-gradient-soft sm:flex-row sm:items-center">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-brand-magenta shadow-card">
                  <Paperclip className="h-6 w-6" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-brand-ink">{fileName || "Click to upload or drag and drop"}</span>
                  <span className="mt-1 block text-sm text-brand-ink-soft">Supports JPG, PNG, PDF, DOC, DOCX. Max 5MB.</span>
                </span>
                <input
                  type="file"
                  name="attachment"
                  className="sr-only"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
                />
              </label>
            </FieldLabel>

            <div className="flex flex-col gap-4 rounded-2xl bg-brand-bg/70 p-4 text-sm text-brand-ink-soft sm:flex-row sm:items-center">
              <AlertCircle className="h-5 w-5 shrink-0 text-brand-accent" aria-hidden />
              If someone is in immediate danger, contact local emergency services first. Use this form after you are safe.
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-brand-magenta/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="reset"
                onClick={() => {
                  setDescription("");
                  setFileName("");
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-magenta/20 bg-white px-6 font-display font-semibold text-brand-ink transition hover:border-brand-magenta/40 hover:text-brand-magenta focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/30"
              >
                <X className="h-4 w-4" aria-hidden /> Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-7 font-display font-semibold text-white shadow-glow transition hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/30"
              >
                <Send className="h-4 w-4" aria-hidden /> Submit
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function FieldLabel({ label, required, optional, children }: { label: string; required?: boolean; optional?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-sm font-bold text-brand-ink">
        {label}
        {required ? <span className="text-brand-magenta"> *</span> : null}
        {optional ? <span className="font-sans font-normal text-brand-ink-soft"> (Optional)</span> : null}
      </span>
      {children}
    </label>
  );
}

function SelectField({ name, placeholder, options }: { name: string; placeholder: string; options: string[] }) {
  return (
    <span className="relative block">
      <select
        name={name}
        defaultValue=""
        className="h-14 w-full appearance-none rounded-2xl border border-brand-magenta/15 bg-white px-4 pr-12 text-brand-ink outline-none transition invalid:text-brand-ink-soft focus:border-brand-magenta focus:ring-4 focus:ring-brand-magenta/15"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-ink-soft" aria-hidden />
    </span>
  );
}
