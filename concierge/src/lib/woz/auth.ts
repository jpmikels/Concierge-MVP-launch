import { cookies } from "next/headers";

const WOZ_COOKIE_NAME = "woz_auth";
const WOZ_ACCESS_KEY = process.env.WOZ_ACCESS_KEY || "dev-woz-key";

export async function isWozAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(WOZ_COOKIE_NAME);
  return authCookie?.value === WOZ_ACCESS_KEY;
}

export function validateWozKey(key: string): boolean {
  return key === WOZ_ACCESS_KEY;
}

export { WOZ_COOKIE_NAME, WOZ_ACCESS_KEY };
