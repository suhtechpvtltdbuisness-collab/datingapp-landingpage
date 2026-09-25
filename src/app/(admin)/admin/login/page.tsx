import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FlashStack from "../_components/FlashStack";
import { cx, field, fieldLabel, nativeControl } from "../_components/ui";
import { login } from "../actions";
import { getFlashes } from "@/lib/admin/flash";
import { getSession, safeNext } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

const input = cx(
  nativeControl,
  "w-full rounded-full border border-white/40 bg-white/[0.16] px-4 py-[13px] text-[14px] text-white outline-none placeholder:text-white/65 focus:border-white focus:bg-white/[0.24]",
);

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getSession()) redirect("/admin");
  const next = safeNext((await searchParams).next) ?? "";
  const flashes = await getFlashes();

  return (
    <>
      {flashes && <FlashStack key={flashes.id} messages={flashes.messages} />}
      <div className="flex min-h-screen items-center justify-center bg-admin-auth p-6">
        <div className="w-full max-w-[400px] rounded-[28px] border border-white/35 bg-white/[0.14] px-8 py-10 text-white shadow-admin-auth backdrop-blur-[22px] max-[560px]:px-[22px] max-[560px]:py-8">
          <div className="mb-1 text-center text-[26px] font-extrabold tracking-[0.5px]">💗 DatingApp Admin</div>
          <div className="mb-7 text-center text-[13px] opacity-[0.85]">Sign in to manage users, matches &amp; reports</div>

          <form action={login}>
            <input type="hidden" name="next" value={next} />
            <div className={field}>
              <label htmlFor="username" className={fieldLabel}>Username</label>
              <input id="username" name="username" type="text" placeholder="admin" autoFocus required className={input} />
            </div>
            <div className={field}>
              <label htmlFor="password" className={fieldLabel}>Password</label>
              <input id="password" name="password" type="password" placeholder="••••••••" required className={input} />
            </div>
            <button
              className="w-full cursor-pointer rounded-full bg-white p-3.5 [font-family:revert] [line-height:revert] text-[15px] font-bold text-admin-primary transition-[transform,box-shadow] duration-150 ease-in-out hover:-translate-y-px hover:shadow-admin-lift"
              type="submit"
            >
              Sign in
            </button>
          </form>

          <div className="mt-5 text-center text-[12px] leading-normal opacity-75">
            First run? The default login was printed in your terminal when the server started (username{" "}
            <strong>admin</strong>). Change it from Settings right after signing in.
          </div>
        </div>
      </div>
    </>
  );
}
