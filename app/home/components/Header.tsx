"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Logo from "./Logo";
import { useAuth } from "../hooks/useAuth";

const serviceCategories = [
  { name: "Solar, Renewables and More", icon: "solar_power", href: "#" },
  { name: "Cars, Vans and Rides", icon: "directions_car", href: "#" },
  { name: "Food, Groceries and Household", icon: "restaurant", href: "#" },
  { name: "Health and Wellness", icon: "health_and_safety", href: "#" },
  { name: "Events and Studios", icon: "celebration", href: "#" },
  { name: "A Better You", icon: "school", href: "#" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, setShowAuth, setShowDashboard } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<"services" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  const servicesRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside to close dropdowns
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      servicesRef.current &&
      !servicesRef.current.contains(e.target as Node)
    ) {
      setActiveDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ESC to close dropdowns/mobile
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className={`glass-nav sticky top-0 z-50 px-4 md:px-6 transition-all duration-200 ${
          scrolled
            ? "border-b border-outline-variant/15 shadow-sm"
            : "border-b border-transparent"
        }`}
        style={{ height: 72 }}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between relative">
          {/* Logo (left) */}
          <a href="/" className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-extrabold tracking-tight text-primary">
              LagosApps
            </span>
          </a>

          {/* Desktop Nav (center) */}
          <nav
            className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2"
            aria-label="Main navigation"
          >
            {/* Services Dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "services" ? null : "services",
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveDropdown(
                      activeDropdown === "services" ? null : "services",
                    );
                  }
                }}
                className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                aria-expanded={activeDropdown === "services"}
                aria-haspopup="menu"
              >
                Services
                <span className="material-symbols-outlined text-[18px]">
                  {activeDropdown === "services"
                    ? "expand_less"
                    : "expand_more"}
                </span>
              </button>
              {activeDropdown === "services" && (
                <div
                  role="menu"
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[260px] max-w-[90vw] z-50"
                  style={{ animation: "modal-scale-in 150ms ease-out" }}
                >
                  {serviceCategories.map((cat) => (
                    <a
                      key={cat.name}
                      href={cat.href}
                      role="menuitem"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary-fixed/30 transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        {cat.icon}
                      </span>
                      {cat.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* CTA button (desktop) */}
            <a
              href="#membership"
              className="hidden md:inline-flex bg-primary-gradient text-on-primary px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/10 hover:brightness-[0.92] active:scale-[0.98] transition-all duration-150"
            >
              Join LagosApps
            </a>

            {/* Notification bell + Avatar (desktop) */}
            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center gap-3">
                {/* Bell */}
                <button
                  onClick={() => setShowDashboard(true)}
                  className="relative cursor-pointer hover:opacity-80 transition-opacity"
                  aria-label="Notifications"
                >
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    notifications
                  </span>
                  {user && (
                    <span className="absolute -top-1 -right-1 size-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      3
                    </span>
                  )}
                </button>
                {/* Avatar */}
                <button
                  onClick={() => setShowDashboard(true)}
                  className="size-10 rounded-full cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all overflow-hidden"
                  aria-label="Open dashboard"
                  title={user.name}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <a
                  href="/subscribe/account"
                  className="text-sm font-semibold text-primary hover:underline px-3 py-2 transition-colors"
                >
                  Log In
                </a>
                <a
                  href="/subscribe/account"
                  className="bg-primary-gradient text-on-primary px-5 py-2.5 rounded-full text-sm font-bold hover:brightness-[0.92] active:scale-[0.98] transition-all duration-150"
                >
                  Sign Up
                </a>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center cursor-pointer"
              style={{ width: 44, height: 44 }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <span className="material-symbols-outlined text-[28px] text-primary">
                menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-white flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          style={{ animation: "slide-in-right 300ms ease-out" }}
        >
          {/* Mobile header */}
          <div
            className="flex items-center justify-between px-4"
            style={{ height: 64 }}
          >
            <a
              href="/"
              className="flex items-center gap-3"
              onClick={() => setMobileOpen(false)}
            >
              <Logo />
              <span className="text-xl font-extrabold tracking-tight text-primary">
                LagosApps
              </span>
            </a>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center cursor-pointer"
              style={{ width: 44, height: 44 }}
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[28px] text-primary">
                close
              </span>
            </button>
          </div>

          {/* Mobile nav items */}
          <nav
            className="flex-1 overflow-y-auto px-4 py-4"
            aria-label="Mobile navigation"
          >
            {/* Services accordion */}
            <div className="border-b border-outline-variant/10">
              <button
                className="w-full flex items-center justify-between py-4 text-lg font-bold text-primary cursor-pointer"
                onClick={() =>
                  setMobileAccordion(
                    mobileAccordion === "services" ? null : "services",
                  )
                }
                aria-expanded={mobileAccordion === "services"}
              >
                Services
                <span className="material-symbols-outlined text-[20px]">
                  {mobileAccordion === "services"
                    ? "expand_less"
                    : "expand_more"}
                </span>
              </button>
              {mobileAccordion === "services" && (
                <div className="pb-4 space-y-1">
                  {serviceCategories.map((cat) => (
                    <a
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center gap-3 py-3 pl-4 text-base text-on-surface hover:bg-primary-fixed/20 rounded-md transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        {cat.icon}
                      </span>
                      {cat.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/2348001234567?text=Hi%20LagosApps%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mt-4 py-4 px-4 rounded-lg text-white font-bold"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat with us on WhatsApp
            </a>

            {/* Account section */}
            <div className="mt-4">
              {isAuthenticated && user ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowDashboard(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm text-primary">
                      {user.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      View Dashboard
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[20px]">
                    chevron_right
                  </span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <a
                    href="/subscribe/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 flex items-center justify-center border-2 border-primary text-primary px-5 py-4 rounded-full text-base font-bold transition-colors hover:bg-primary-fixed/30"
                  >
                    Log In
                  </a>
                  <a
                    href="/subscribe/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 flex items-center justify-center bg-primary-gradient text-on-primary px-5 py-4 rounded-full text-base font-bold"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
