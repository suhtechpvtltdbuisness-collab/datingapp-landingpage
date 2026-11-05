import Sidebar from "../_components/Sidebar";
import { requireAdmin } from "@/lib/admin/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="flex min-h-screen max-[860px]:flex-col">
      <Sidebar admin={admin} />
      <main className="mx-auto min-w-0 max-w-[1280px] flex-1 px-[34px] pb-[60px] pt-7 max-[860px]:m-0 max-[860px]:w-full max-[860px]:px-3.5 max-[860px]:pb-12 max-[860px]:pt-4">
        {children}
      </main>
    </div>
  );
}
