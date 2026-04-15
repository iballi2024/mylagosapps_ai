import React from "react";
import Hero from "./Hero";
import "../index.css";
import ServiceCategories from "./components/ServiceCategories";
import MembershipLedger from "./components/MembershipLedger";
import VerifiedInsights from "./components/VerifiedInsights";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import WhatsAppFAB from "./components/ui/WhatsAppFAB";
// ── Header variants — uncomment one to test ──────────────────────────────
import Header  from "./components/Header";   // Tailwind-only (original)
import Header2 from "./components/Header2";  // Mantine + Tailwind (active)
import Navbar  from "@/components/Navbar";   // Alternate navbar

export default function Home() {
  return (
    <>
      {/* ── Swap headers here for testing ─────────────────────────────────── */}
      {/* <Navbar /> */}
      {/* <Header /> */}
      <Header2 />
      {/* ─────────────────────────────────────────────────────────────────── */}

      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <main id="main-content">
        <Hero />
        <ServiceCategories />
        {/* WhatsApp Banner — overlays the boundary between Services and Membership */}
        <div className="relative z-10 px-4 md:px-6 lg:px-10 -mb-8 md:-mb-10">
          <a
            href="https://wa.me/2348001234567?text=Hi%20LagosApps%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-7xl mx-auto flex items-center justify-between gap-4 rounded-2xl px-6 md:px-10 py-5 md:py-6 transition-all hover:brightness-[0.95] group shadow-lg"
            style={{ backgroundColor: "#25D366" }}
          >
            <div className="flex items-center gap-4 md:gap-5">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
                className="flex-shrink-0"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div>
                <p className="text-white font-extrabold text-lg md:text-xl">
                  Chat with us on WhatsApp
                </p>
                <p className="text-white/80 text-sm md:text-base">
                  Got questions? Our team is online and ready to help you right
                  now.
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white text-[28px] group-hover:translate-x-1 transition-transform flex-shrink-0">
              arrow_forward
            </span>
          </a>
        </div>
        <MembershipLedger />
        <VerifiedInsights />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
