"use client";

import { useFormStatus } from "react-dom";
import { cx } from "./ui";

interface Props {
  idleText?: string;
  loadingText?: string;
  className?: string;
}

export default function SubmitButton({
  idleText = "Sign in",
  loadingText = "Signing in...",
  className,
}: Props) {
  const { pending } = useFormStatus();

  const buttonClasses = className
    ? cx(
        className,
        "inline-flex items-center justify-center gap-1.5 transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-70",
      )
    : "w-full cursor-pointer rounded-full bg-white p-3.5 [font-family:revert] [line-height:revert] text-[15px] font-bold text-admin-primary transition-[transform,box-shadow,opacity] duration-150 ease-in-out hover:-translate-y-px hover:shadow-admin-lift disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2";

  return (
    <button type="submit" disabled={pending} className={buttonClasses}>
      {pending ? (
        <>
          <svg
            className="h-4 w-4 animate-spin shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        idleText
      )}
    </button>
  );
}

