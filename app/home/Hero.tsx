import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-surface border-b border-outline-variant/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-12 md:py-24 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className="md:col-span-7 space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary-fixed px-3 py-1 rounded-full">
            <span className="material-symbols-outlined filled text-[14px]">
              verified
            </span>
            <span className="text-[11px] uppercase tracking-widest font-bold">
              Trusted by Lagosians
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-primary leading-[1.05] tracking-tighter">
            Power Your Life{" "}<br></br>
            <span className="text-primary-container/40">in Lagos.</span>
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Solar for your home. A car when you need one. Groceries at your door.
            A doctor on call. All from one account. LagosApps brings it all together.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <a
              href="#membership"
              className="bg-primary-gradient text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-full text-base font-bold flex items-center gap-2 group hover:brightness-[0.92] active:scale-[0.98] transition-all duration-150"
            >
              <span>Join LagosApps</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
            <a
              href="#services"
              className="px-6 md:px-8 py-3 md:py-4 rounded-full text-base font-bold border border-outline-variant/30 hover:bg-surface-container active:scale-[0.98] transition-all duration-150"
            >
              Browse Services
            </a>
          </div>

          {/* Service icons strip */}
          <div className="flex flex-wrap gap-4 md:gap-6 pt-2">
            {[
              { icon: "solar_power", label: "Solar" },
              { icon: "directions_car", label: "Cars & Vans" },
              { icon: "restaurant", label: "Groceries" },
              { icon: "health_and_safety", label: "Health" },
              { icon: "celebration", label: "Events" },
              { icon: "school", label: "A Better You" },
            ].map((s) => (
              <a
                key={s.label}
                href="#services"
                className="flex flex-col items-center gap-1 group"
              >
                <span className="material-symbols-outlined text-outline/40 text-[28px] group-hover:text-primary transition-colors">
                  {s.icon}
                </span>
                <span className="text-[10px] font-semibold text-outline/50 uppercase tracking-wider group-hover:text-primary transition-colors">
                  {s.label}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 relative">
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low relative">
            <Image
              fill
              className="object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              alt="Lagos professional in a modern office"
              src="/images/executive.jpg"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 p-3 md:p-4 bg-surface-container-lowest/90 backdrop-blur-md rounded-lg">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                  LA
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">LagosApps Member</p>
                  <p className="text-[10px] text-on-surface-variant uppercase font-medium">
                    Solar + Transport + Groceries — One Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-fixed-dim/20 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
}
