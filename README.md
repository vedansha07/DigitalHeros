# Digital Heros | Systematic Philanthropy Engine

Digital Heros is a high-fidelity, subscription-based architectural platform connecting fractional capital distribution with philanthropic giving, gamified mathematically via Stableford golf scoring metrics. Wait, strictly *no golf clichés*. The platform operates as a robust node execution ledger handling dynamic chronological distributions securely.

Built strictly with Next.js 14, Tailwind CSS, Framer Motion, Supabase, Stripe, and Resend.

---

## Technical Stack
- **Frontend Core**: Next.js 14 (App Router)
- **Design System**: Tailwind CSS, Framer Motion (Deep Navy `#0B1F3A` + Vibrant Green `#00C96B`)
- **Database/Auth**: Supabase v2 (PostgreSQL + RLS)
- **Transaction Logistics**: Stripe (`subscriptions`, `checkout`, `webhooks`)
- **Action Triggers**: Resend + React Email

---

## 1. Local Initialization

Follow these exact execution steps to boot the local environment:

1. **Install Dependencies**:
```bash
npm install
```

2. **Configure Environment Parameters**:
Copy the `.env.example` structure manually to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=re_...
```

3. **Initialize the Server**:
```bash
npm run dev
```

---

## 2. Test Accounts & Simulation Credentials

### Access Tiers
- **Admin Terminal**: 
  - Login: `admin@test.com`
  - Password: `password`
- **Node User**: 
  - Login: `user@test.com`
  - Password: `password`

### Stripe Simulation Cards
Bypass payment gates using standard development integers:
- **Card Matrix**: `4242 4242 4242 4242`
- **Expiry**: `Any valid future date (e.g., 12/28)`
- **CVV**: `Any 3 digits (e.g., 123)`

---

## 3. Webhook Simulation (Local Testing)
Because Stripe callbacks dictate database states, you must tunnel development webhooks using the Stripe CLI:

1. Boot your Next Server: `npm run dev`
2. Forward the traffic:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
3. Copy the returning `whsec_...` signature into your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

---

## 4. Draw Execution Playbook

The core logic of this platform revolves around the `Draw Engine`. Admins trigger this distribution.

1. Authenticate as `<admin@test.com>`.
2. Navigate to `System Overview` -> `Draw Engine`.
3. Select `Initialize Parameters` for the current active chronological period.
4. Define the execution variant (`Random Generation` vs `Frequency Algorithmic Array`).
5. Run **"Simulate Draft"** - This dry-runs the mathematical splits and fractional jackpot rollovers without modifying public ledgers.
6. Verify output vectors. 
7. Click **"Publish Ledger"**. *Warning: This action physically executes DB commits and immediately dispatches Resend notification vectors to all winning users.*

---

## 5. Deployment Guide (Vercel + Supabase)

### Database Topology (Supabase)
Ensure your production instance matches the SQL schemas stored in `/supabase/migrations`.
Execute these via the Supabase CLI:
```bash
supabase link --project-ref your_project_id
supabase db push
```

### Application Topology (Vercel)
1. Link your Github Repository to a new Vercel Instance.
2. Under "Environment Variables", inject ALL identical strings from your `.env.local` exactly. Note: swap `NEXT_PUBLIC_BASE_URL` to your production domain (e.g., `https://digitalheros.app`).
3. Inside your Stripe Developer Dashboard, navigate to **Webhooks** -> Create an Endpoint -> Point to `<production_url>/api/stripe/webhook`.
4. Monitor Vercel build logs. Deploy.
