"use client";
import { useState } from "react";
import Button from "./ui/Button";

interface Tier {
  name: string;
  annualPrice: string;
  quarterlyPrice: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const tiers: Tier[] = [
  {
    name: "Bronze",
    annualPrice: "₦100,000",
    quarterlyPrice: "₦30,000",
    features: [
      "Free basic health check (registration required)",
      "Free tickets to LagosApps Concerts and Events",
      "Free Solar Audit",
    ],
  },
  {
    name: "Silver",
    annualPrice: "₦250,000",
    quarterlyPrice: "₦75,000",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "1 free Car rental or 1 free Van/Bus rental",
      "Free Grocery Delivery once a month",
      "Free basic health check (registration required)",
      "Free tickets to LagosApps Concerts and Events",
      "Free Solar Audit",
    ],
  },
  {
    name: "Gold",
    annualPrice: "₦500,000",
    quarterlyPrice: "₦200,000",
    features: [
      "Free 2-day stay at Mainland Wellness Centre OR at-home medical tests and checks (max 4 people)",
      "Free Grocery Delivery twice a month",
      "1 free Car rental or 1 free Van/Bus rental",
      "Free basic health check (registration required)",
      "Free tickets to LagosApps Concerts and Events",
      "Free Solar Audit",
    ],
  },
];

export default function MembershipLedger() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="membership" className="pt-20 md:pt-28 pb-16 md:pb-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
            One Membership. Every Service.
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            LagosApps membership unlocks free services you'd normally pay for
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
              Quarterly
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsAnnual(!isAnnual); } }}
              className="w-12 h-6 bg-primary-container rounded-full relative p-1 cursor-pointer focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2"
              role="switch"
              aria-checked={isAnnual ? "true" : "false"}
              aria-label="Toggle between annual and quarterly billing"
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
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {tiers.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.quarterlyPrice;
            const period = isAnnual ? "/year" : "/quarter";

            return tier.highlighted ? (
              <div
                key={tier.name}
                className="bg-primary text-on-primary rounded-xl p-6 md:p-8 flex flex-col h-full shadow-2xl shadow-primary/20 md:scale-105 relative z-10"
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-fixed text-primary px-4 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    {tier.badge}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2 text-primary-fixed">
                    {tier.name}
                  </h3>
                  <p className="text-3xl font-extrabold">
                    {price}
                    <span className="text-sm font-normal opacity-70">{period}</span>
                  </p>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span className="material-symbols-outlined text-primary-fixed text-[20px] flex-shrink-0">
                        check_circle
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="secondary"
                  className="w-full !bg-white !text-primary !border-white hover:!brightness-95"
                >
                  Subscribe Now
                </Button>
              </div>
            ) : (
              <div
                key={tier.name}
                className="bg-surface-container-lowest rounded-xl p-6 md:p-8 flex flex-col h-full border border-outline-variant/10"
              >
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-3xl font-extrabold text-primary">
                    {price}
                    <span className="text-sm font-normal text-on-surface-variant">{period}</span>
                  </p>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">
                        check_circle
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" className="w-full">
                  Subscribe Now
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
