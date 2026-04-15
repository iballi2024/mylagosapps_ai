"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What is LagosApps?",
    a: "LagosApps is a membership-based platform that gives Lagos residents access to a wide range of services — food delivery, car hire, health & wellness, events, solar energy, office supplies, and more — all under one subscription.",
  },
  {
    q: "How does a LagosApps membership work?",
    a: "You pick a plan (Bronze, Silver, or Gold), pay a monthly or annual fee, and instantly unlock free and discounted services across all our subsidiaries. The higher the tier, the more services and savings you get each month.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. You can cancel from your dashboard at any time. Your membership stays active until the end of the billing period — we don't charge you again after cancellation.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Nigerian debit/credit cards, bank transfers, and USSD. All payments are processed securely through our payment partners.",
  },
  {
    q: "Which areas of Lagos do you serve?",
    a: "We currently cover Mainland Lagos (Surulere, Yaba, Shomolu, Mushin, Oshodi, Ikeja, and surroundings). Island coverage (VI, Lekki, Ikoyi) is coming soon.",
  },
  {
    q: "How do I book or order a service?",
    a: "Log in to your dashboard, go to the service you need, and follow the steps. Most bookings take under 2 minutes. You can also WhatsApp us and a team member will assist you directly.",
  },
  {
    q: "Is my personal data safe?",
    a: "Yes. We use industry-standard encryption for all data in transit and at rest. We never sell your personal information to third parties.",
  },
  {
    q: "What happens if I have a complaint?",
    a: "Log in and use the Contact Admin page in your dashboard to submit a complaint. Our team reviews every submission within 24 hours on business days. For urgent issues, WhatsApp is the fastest channel.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i));

  return (
    <section id="faq" className="py-16 md:py-24 px-4 md:px-6 lg:px-10 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight">
              Questions people actually ask
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Can&apos;t find what you&apos;re looking for? Reach us on{" "}
              <a
                href="https://wa.me/2348001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                WhatsApp
              </a>{" "}
              or use the{" "}
              <a
                href="/#contact"
                className="text-primary font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                contact form
              </a>{" "}
              below.
            </p>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-8 divide-y divide-outline-variant/20">
            {faqs.map((item, i) => (
              <div key={i} className="py-5">
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-start justify-between gap-4 text-left cursor-pointer group"
                  aria-expanded={open === i}
                >
                  <span className="text-base font-bold text-primary group-hover:opacity-80 transition-opacity leading-snug">
                    {item.q}
                  </span>
                  <span
                    className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5 transition-transform duration-200"
                    style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    add
                  </span>
                </button>

                {open === i && (
                  <p className="mt-3 text-sm text-on-surface-variant leading-relaxed pr-8">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
