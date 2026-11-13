/** Where the dating backend (new_dating_app_backend) is running. */
export function backendUrl(): string {
  const raw =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://127.0.0.1:5001";
  return raw.split("#")[0].trim().replace(/\/+$/, "");
}
