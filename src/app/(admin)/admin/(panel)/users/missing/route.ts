import { redirect } from "next/navigation";
import { flash } from "@/lib/admin/flash";

/** Where a missing user id lands: flash "User not found." and go back to the list. */
export async function GET() {
  await flash("User not found.", "error");
  redirect("/admin/users");
}
