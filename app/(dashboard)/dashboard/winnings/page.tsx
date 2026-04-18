import { requireAuth } from "@/lib/supabase/auth";
import UserWinningsClient from "./UserWinningsClient";
import BackButton from "@/components/ui/BackButton";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default async function WinningsPage() {
  await requireAuth();
  return (
    <div className="space-y-1">
      <BackButton href="/dashboard" label="Back to Dashboard" />
      <Breadcrumb crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "My Winnings" }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary tracking-tight">My Winnings</h1>
        <p className="text-muted text-sm font-medium mt-1.5 max-w-xl">
          Upload your certified scorecard to verify a win. Admin review typically completes within 24 hours.
        </p>
      </div>
      <UserWinningsClient />
    </div>
  );
}
