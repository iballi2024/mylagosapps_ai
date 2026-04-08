"use client";
import { useState, useEffect } from "react";
import Button from "./ui/Button";
import { apiGetPlans, type SubscriptionPlan } from "@/lib/billing";

function PlanCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 flex flex-col border border-outline-variant/10 animate-pulse">
      <div className="h-5 w-24 bg-outline-variant/30 rounded mb-2" />
      <div className="h-3 w-full bg-outline-variant/20 rounded mb-1" />
      <div className="h-3 w-3/4 bg-outline-variant/20 rounded mb-5" />
      <div className="h-9 w-36 bg-outline-variant/30 rounded mb-8" />
      <ul className="space-y-4 mb-10 grow">
        {Array.from({ length: 5 }).map((_, j) => (
          <li key={j} className="flex items-center gap-3">
            <div className="size-5 rounded-full bg-outline-variant/30 shrink-0" />
            <div className="h-3 rounded bg-outline-variant/20" style={{ width: `${60 + (j % 3) * 15}%` }} />
          </li>
        ))}
      </ul>
      <div className="h-10 w-full bg-outline-variant/30 rounded-lg" />
    </div>
  )
}

const TIER_META: Record<string, { highlighted?: boolean; badge?: string }> = {
  gold: { highlighted: true, badge: "Best Value" },
};

export default function MembershipLedger() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGetPlans()
      .then(data => {
        const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
        // Move highlighted plan (gold) to center position
        const highlightedIdx = sorted.findIndex(p => TIER_META[p.slug]?.highlighted);
        if (highlightedIdx > 0 && highlightedIdx !== 1) {
          const [highlighted] = sorted.splice(highlightedIdx, 1);
          sorted.splice(1, 0, highlighted);
        }
        setPlans(sorted);
      })
      .catch(e => setError(e?.message ?? "Failed to load plans."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="membership" className="pt-20 md:pt-28 pb-16 md:pb-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
            One Membership. Every Service.
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            LagosApps membership unlocks free services you&apos;d normally pay for
            — health checks, car rentals, grocery deliveries, event tickets,
            and solar audits. Pick the tier that fits your life.
          </p>
          <div className="flex items-center justify-center gap-4 pt-6">
            <span
              className={`text-sm font-bold cursor-pointer transition-colors ${!isAnnual ? "text-primary" : "text-outline"}`}
              onClick={() => setIsAnnual(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsAnnual(false); } }}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsAnnual(!isAnnual); } }}
              className="w-12 h-6 bg-primary-container rounded-full relative p-1 cursor-pointer focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2"
              role="switch"
              aria-checked={isAnnual ? "true" : "false"}
              aria-label="Toggle between annual and monthly billing"
            >
              <div
                className={`size-4 bg-white rounded-full absolute transition-all duration-200 ${
                  isAnnual ? "right-1" : "left-1"
                }`}
                style={{ top: 4 }}
              />
            </button>
            <span
              className={`text-sm font-bold cursor-pointer transition-colors ${isAnnual ? "text-primary" : "text-outline"}`}
              onClick={() => setIsAnnual(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsAnnual(true); } }}
            >
              Annual
            </span>
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-error mb-8">{error}</p>
        )}

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Left card skeleton (bronze) */}
            <PlanCardSkeleton />

            {/* Middle highlighted card skeleton (gold) */}
            <div className="bg-primary rounded-xl p-6 md:p-8 flex flex-col md:scale-105 relative z-10 animate-pulse">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-6 w-24 bg-primary-fixed/40 rounded" />
              <div className="h-5 w-24 bg-primary-fixed/40 rounded mb-2" />
              <div className="h-3 w-full bg-primary-fixed/20 rounded mb-1" />
              <div className="h-3 w-3/4 bg-primary-fixed/20 rounded mb-5" />
              <div className="h-9 w-36 bg-primary-fixed/40 rounded mb-8" />
              <ul className="space-y-4 mb-10 grow">
                {Array.from({ length: 5 }).map((_, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-primary-fixed/40 shrink-0" />
                    <div className="h-3 rounded bg-primary-fixed/20" style={{ width: `${60 + (j % 3) * 15}%` }} />
                  </li>
                ))}
              </ul>
              <div className="h-10 w-full bg-primary-fixed/40 rounded-lg" />
            </div>

            {/* Right card skeleton (gold) */}
            <PlanCardSkeleton />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {plans.map((plan) => {
              const meta = TIER_META[plan.slug] ?? {};
              const price = isAnnual
                ? `₦${plan.priceYearly.toLocaleString()}`
                : `₦${Math.round(plan.priceMonthly).toLocaleString()}`;
              const period = isAnnual ? "/year" : "/month";
              const billing = isAnnual ? "annual" : "monthly";

              return meta.highlighted ? (
                <div
                  key={plan.id}
                  className="bg-primary text-on-primary rounded-xl p-6 md:p-8 flex flex-col h-full shadow-2xl shadow-primary/20 md:scale-105 relative z-10"
                >
                  {meta.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-fixed text-primary px-4 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                      {meta.badge}
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-1 text-primary-fixed">{plan.name}</h3>
                    <p className="text-xs opacity-70 mb-2">{plan.description}</p>
                    <p className="text-3xl font-extrabold">
                      {price}
                      <span className="text-sm font-normal opacity-70">{period}</span>
                    </p>
                  </div>
                  <ul className="space-y-4 mb-10 grow">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit.id} className="flex items-start gap-3 text-sm">
                        <span className="material-symbols-outlined text-primary-fixed text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>{benefit.name}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={`/subscribe/plan?slug=${plan.slug}&billing=${billing}`} className="w-full">
                    <Button variant="secondary" className="w-full bg-white! text-primary! border-white! hover:brightness-95!">
                      Subscribe Now
                    </Button>
                  </a>
                </div>
              ) : (
                <div
                  key={plan.id}
                  className="bg-surface-container-lowest rounded-xl p-6 md:p-8 flex flex-col h-full border border-outline-variant/10"
                >
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-xs text-on-surface-variant mb-2">{plan.description}</p>
                    <p className="text-3xl font-extrabold text-primary">
                      {price}
                      <span className="text-sm font-normal text-on-surface-variant">{period}</span>
                    </p>
                  </div>
                  <ul className="space-y-4 mb-10 grow">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit.id} className="flex items-start gap-3 text-sm">
                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>{benefit.name}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={`/subscribe/plan?slug=${plan.slug}&billing=${billing}`} className="w-full">
                    <Button variant="secondary" className="w-full">
                      Subscribe Now
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
