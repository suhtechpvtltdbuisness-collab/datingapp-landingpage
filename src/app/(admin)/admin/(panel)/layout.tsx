import Sidebar from "../_components/Sidebar";
import { requireAdmin } from "@/lib/admin/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen max-[860px]:flex-col">
      <Sidebar />
      <main className="mx-auto min-w-0 max-w-[1280px] flex-1 px-[34px] pb-[60px] pt-7 max-[860px]:m-0 max-[860px]:w-full max-[860px]:px-4 max-[860px]:pb-12 max-[860px]:pt-5">
        {children}
      </main>
    </div>
  );
}
