"use client";
import { buttonClass } from "./ui";

/** Delete button that asks for confirmation before submitting. */
export default function ConfirmDeleteForm({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Permanently delete this user? This cannot be undone.")) e.preventDefault();
      }}
    >
      <button className={buttonClass("ghost-danger")} type="submit">🗑 Delete account</button>
    </form>
  );
}
