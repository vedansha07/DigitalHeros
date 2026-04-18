import { createClient } from "@/lib/supabase/server";
import CharityProfileClient from "./CharityProfileClient";
import { getCurrentUser } from "@/lib/supabase/auth";
import BackButton from "@/components/ui/BackButton";
import { notFound } from "next/navigation";

export default async function CharityProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: charity } = await supabase
    .from("charities")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!charity) notFound();

  const user = await getCurrentUser();

  return (
    <>
      {/* Back button positioned above page content */}
      <div className="bg-primary pt-28 pb-6 px-5 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <BackButton href="/charities" label="Back to Charities" />
        </div>
      </div>
      <CharityProfileClient charity={charity} isSubscribed={!!user?.dbUser} />
    </>
  );
}
