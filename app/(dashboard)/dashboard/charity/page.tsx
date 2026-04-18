import { requireAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import CharitySettingsClient from "./CharitySettingsClient";
import BackButton from "@/components/ui/BackButton";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default async function DashboardCharityPage() {
  const { dbUser } = await requireAuth();
  const supabase = createClient();
  const { data: charities } = await supabase
    .from("charities")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-1">
      <BackButton href="/dashboard" label="Back to Dashboard" />
      <Breadcrumb crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Charity Settings" }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary tracking-tight">Charity Settings</h1>
        <p className="text-muted text-sm font-medium mt-1.5 max-w-xl">
          Choose a cause you care about. Your specified percentage is automatically donated every time your subscription renews.
        </p>
      </div>
      <CharitySettingsClient dbUser={dbUser} charities={charities || []} />
    </div>
  );
}
