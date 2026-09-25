"use client";
import { useEffect, useState } from "react";
import { cx } from "./ui";
import type { FlashMessage } from "@/lib/admin/flash";

interface Props {
  messages: FlashMessage[];
  /** Panel pages hide the stack after 4s; the login page keeps it. */
  autoHide?: boolean;
}

export default function FlashStack({ messages, autoHide = false }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Each message is shown once.
    document.cookie = "admin_flash=; Path=/admin; Max-Age=0; SameSite=Lax";
    if (!autoHide) return;
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [autoHide]);

  if (!visible) return null;
  return (
    <div className="fixed right-5 top-5 z-[100] flex flex-col gap-2.5 max-[860px]:left-3 max-[860px]:right-3 max-[860px]:top-3">
      {messages.map((m, i) => (
        <div
          key={i}
          className={cx(
            "min-w-[240px] rounded-[14px] px-5 py-[13px] text-[13.5px] font-semibold text-white shadow-admin-flash max-[860px]:min-w-0",
            m.category === "success" ? "bg-admin-grad-success" : "bg-admin-grad-error",
          )}
        >
          {m.message}
        </div>
      ))}
    </div>
  );
}
