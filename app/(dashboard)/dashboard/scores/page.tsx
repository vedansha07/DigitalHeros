import { requireAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import ScoresPageClient from "./ScoresPageClient";

export const dynamic = "force-dynamic";

export default async function ScoresPage() {
  const { dbUser } = await requireAuth();
  const supabase = createClient();

  const { data: scores } = await supabase
    .from("golf_scores")
    .select("*")
    .eq("user_id", dbUser.id)
    .order("score_date", { ascending: false });

  return (
    <ScoresPageClient
      dbUser={dbUser}
      scores={scores || []}
    />
  );
}
