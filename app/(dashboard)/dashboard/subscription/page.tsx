import { requireAuth } from "@/lib/supabase/auth";
import SubscriptionManager from "./SubscriptionManager";
import { createClient } from "@/lib/supabase/server";
import BackButton from "@/components/ui/BackButton";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { CreditCard } from "lucide-react";

export default async function DashboardSubscriptionPage() {
  const { dbUser } = await requireAuth();
  const supabase = createClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", dbUser.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="space-y-1">
      <BackButton href="/dashboard" label="Back to Dashboard" />
      <Breadcrumb crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Membership" }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary tracking-tight">Membership</h1>
        <p className="text-muted text-sm font-medium mt-1.5 max-w-xl">
          Manage your plan, billing, and subscription preferences.
        </p>
      </div>

      {!subscription ? (
        <div className="bg-surface rounded-2xl border border-surface-border shadow-card p-12 text-center max-w-md mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-5">
            <CreditCard size={24} className="text-primary" />
          </div>
          <h2 className="text-lg font-black text-primary mb-2">No active subscription</h2>
          <p className="text-sm text-muted mb-6">You don&apos;t have a subscription yet. Choose a plan to get started.</p>
          <Link
            href="/subscribe"
            className="inline-flex items-center gap-2 bg-accent text-primary font-black text-sm px-6 py-3 rounded-xl hover:bg-accent/90 hover:shadow-glow-sm transition-all"
          >
            View Plans
          </Link>
        </div>
      ) : (
        <SubscriptionManager subscription={subscription} dbUser={dbUser} />
      )}
    </div>
  );
}
