import FlashStack from "./FlashStack";
import { getFlashes } from "@/lib/admin/flash";
import type { AdminSession } from "@/lib/admin/session";

interface Props {
  admin: AdminSession;
  heading: React.ReactNode;
  subheading?: React.ReactNode;
  children: React.ReactNode;
}

/** Page frame shared by every signed-in screen: flash messages + the title bar with the admin chip. */
export default async function AdminPage({ admin, heading, subheading, children }: Props) {
  const flashes = await getFlashes();
  return (
    <>
      {flashes && <FlashStack key={flashes.id} messages={flashes.messages} autoHide />}
      <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3.5 max-[560px]:mb-[18px]">
        <div>
          <h1 className="m-0 text-[24px] font-extrabold max-[860px]:text-[21px]">{heading}</h1>
          <div className="mt-1 text-[13.5px] text-admin-ink-2">{subheading}</div>
        </div>
        <div className="flex items-center gap-2.5 rounded-full border border-white/80 bg-white/70 py-2 pl-2 pr-4 text-[13px] font-semibold max-[560px]:py-1.5 max-[560px]:pl-1.5 max-[560px]:pr-3">
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-admin-brand text-[13px] font-bold text-white">
            {(admin.username || "A")[0].toUpperCase()}
          </div>
          {admin.username}
        </div>
      </div>
      {children}
    </>
  );
}
