"use client";
import { useState, useRef, useEffect } from "react";
import { SERVICE_CATEGORIES } from "@/context/PlatformContext";

export default function ServiceCategories() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = SERVICE_CATEGORIES.find((c) => c.id === selectedId);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll panel into view whenever a new category is opened
  useEffect(() => {
    if (!selectedId || !panelRef.current) return;
    const timer = setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedId]);

  const toggle = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id));

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

        {/* Category cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = selectedId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className={`group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] cursor-pointer text-left w-full${isActive ? " ring-4 ring-primary ring-offset-2" : ""}`}
                aria-label={cat.name}
                aria-expanded={isActive}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt=""
                  src={cat.image}
                  loading="lazy"
                />

                {/* Default gradient overlay — hidden when active */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300${isActive ? " opacity-0" : ""}`}
                />

                {/* Hover / active overlay */}
                <div
                  className={`absolute inset-0 bg-primary/80 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4${isActive ? " opacity-100" : " opacity-0 group-hover:opacity-100"}`}
                >
                  <span className="text-5xl mb-3">{cat.icon}</span>
                  <p className="text-white/90 text-xs md:text-sm mb-4 max-w-[200px] leading-relaxed">
                    {cat.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-md text-sm font-bold">
                    {isActive ? "Close ✕" : "View services →"}
                  </span>
                </div>

                {/* Default bottom label */}
                <div
                  className={`absolute bottom-4 left-4 right-4 transition-opacity duration-300${isActive ? " opacity-0" : " group-hover:opacity-0"}`}
                >
                  <span className="text-2xl mb-1 block">{cat.icon}</span>
                  <h3 className="text-white font-bold text-base md:text-lg">
                    {cat.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expandable sub-items panel */}
        {selected && (
          <div ref={panelRef} className="mt-6 rounded-2xl border border-surface-container-high bg-surface-bright overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selected.icon}</span>
                <div>
                  <h3 className="font-bold text-on-surface text-base">
                    {selected.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {selected.tagline}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container"
                aria-label="Close panel"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {/* Sub-item rows */}
            <div className="divide-y divide-surface-container-high">
              {selected.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <span className="text-xl w-8 text-center flex-shrink-0">
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-sm">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.comingSoon ? (
                    <span className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary-fixed-dim">
                      Coming Soon
                    </span>
                  ) : item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-on-primary hover:bg-primary-container transition-colors no-underline"
                    >
                      Visit
                      <span className="material-symbols-outlined text-[13px]">
                        open_in_new
                      </span>
                    </a>
                  ) : (
                    <span className="flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-surface-container-high">
                      Info
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Panel footer — contact prompt */}
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-on-surface-variant">
                Need something specific? We can help.
              </p>
              <a
                href="/dashboard/contact-admin"
                className="text-xs font-bold text-primary hover:underline no-underline"
              >
                Contact Admin →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
