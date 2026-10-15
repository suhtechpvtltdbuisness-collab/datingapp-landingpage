"use client";
import { useState } from "react";
import { cx } from "./ui";

interface Props {
  id: string;
  name: string;
  placeholder?: string;
  className?: string;
}

/** Password field with a show/hide toggle. */
export default function PasswordInput({ id, name, placeholder, className }: Props) {
  const [shown, setShown] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={shown ? "text" : "password"}
        placeholder={placeholder}
        required
        className={cx(className, "pr-[72px]")}
      />
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-[12px] font-semibold text-white/80 hover:text-white"
      >
        {shown ? "Hide" : "Show"}
      </button>
    </div>
  );
}
