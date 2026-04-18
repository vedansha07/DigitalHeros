import { getCurrentUser } from "@/lib/supabase/auth";
import SubscribeClient from "./SubscribeClient";

export default async function SubscribePage() {
  const user = await getCurrentUser();
  return (
    <SubscribeClient
      dbUser={user?.dbUser || null}
      isLoggedIn={!!user?.authUser}
    />
  );
}
