"use client";
import { useServicePortal } from "../hooks/useServicePortal";
import type { ServicePortalId } from "../hooks/useServicePortal";
import { useAuth } from "../hooks/useAuth";

const categories: {
  name: string;
  icon: string;
  image: string;
  cta: string;
  description: string;
  portalId: ServicePortalId;
}[] = [
  {
    name: "Solar, Renewables and More",
    icon: "solar_power",
    image: "https://plus.unsplash.com/premium_photo-1678766819822-d936a3d6a3ea?w=800&q=80",
    cta: "Get a Free Solar Audit",
    description: "Power your home or business with solar. Book an audit, buy a package, or finance an installation.",
    portalId: "solar",
  },
  {
    name: "Cars, Vans and Rides",
    icon: "directions_car",
    image: "https://images.unsplash.com/photo-1649502913092-fb7f0e8fc632?w=800&q=80",
    cta: "Book a Ride Now",
    description: "Rent a car, hire a van, book a ride, or purchase an EV. Moving Lagos, your way.",
    portalId: "transport",
  },
  {
    name: "Food, Groceries and Household",
    icon: "restaurant",
    image: "https://images.unsplash.com/photo-1759344114577-b6c32e4d68c8?w=800&q=80",
    cta: "Order Groceries",
    description: "Meals, fresh groceries, staples, and household supplies delivered straight to your door.",
    portalId: "groceries",
  },
  {
    name: "Health and Wellness",
    icon: "health_and_safety",
    image: "https://plus.unsplash.com/premium_photo-1682130171029-49261a5ba80a?w=800&q=80",
    cta: "See a Doctor",
    description: "Health checks, teleconsults, home visits, wellness retreats, and medical supplies on demand.",
    portalId: "health",
  },
  {
    name: "Events and Studios",
    icon: "celebration",
    image: "https://plus.unsplash.com/premium_photo-1732464750678-973ff68fbf9d?w=800&q=80",
    cta: "Book a Venue",
    description: "Hire event spaces, TV studios, or audio studios. Find and book tickets to upcoming events.",
    portalId: "events",
  },
  {
    name: "A Better You",
    icon: "school",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    cta: "Get Involved",
    description: "Community programmes, youth education, donations, and social impact through TEPLEARN and Mainland Foundation.",
    portalId: "community",
  },
];

export default function ServiceCategories() {
  const { openPortal } = useServicePortal();
  const { isAuthenticated, setShowAuth, setShowDashboard } = useAuth();

  return (
    <section id="services" className="py-12 md:py-20 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary uppercase">
              What do you need today?
            </h2>
            <p className="text-on-surface-variant max-w-md">
              Six categories. Hundreds of services. Every one of them bookable
              and payable right here — no calls, no follow-ups.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                if (isAuthenticated) {
                  setShowDashboard(true);
                  openPortal(cat.portalId);
                } else {
                  setShowAuth(true);
                }
              }}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] cursor-pointer text-left"
              aria-label={`${cat.name} — ${cat.cta}`}
            >
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt=""
                src={cat.image}
                loading="lazy"
              />
              {/* Default gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Hover overlay with CTA */}
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4">
                <span className="material-symbols-outlined text-white mb-3" style={{ fontSize: 40 }}>
                  {cat.icon}
                </span>
                <p className="text-white/90 text-xs md:text-sm mb-4 max-w-[200px] leading-relaxed">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-md text-sm font-bold">
                  {cat.cta}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>

              {/* Default bottom label */}
              <div className="absolute bottom-4 left-4 right-4 group-hover:opacity-0 transition-opacity duration-300">
                <span className="material-symbols-outlined text-white mb-2">
                  {cat.icon}
                </span>
                <h3 className="text-white font-bold text-base md:text-lg">{cat.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
