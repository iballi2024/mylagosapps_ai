const insights = [
  {
    name: "Adaeze M.",
    badge: "GOLD MEMBER",
    badgeColor: "bg-primary-fixed",
    quote:
      "My whole family did health checks and I booked a wellness retreat — all covered by my Gold membership. This paid for itself in one month.",
    amount: "₦0.00",
    label: "Wellness Retreat",
    image:
      "https://plus.unsplash.com/premium_photo-1682130171029-49261a5ba80a?w=200&q=80",
  },
  {
    name: "Emeka K.",
    badge: "SILVER MEMBER",
    badgeColor: "bg-secondary-fixed",
    quote:
      "Needed a van for my store restock. Booked through Van Lagos, paid with my wallet. 20 minutes, done. No phone calls.",
    amount: "₦0.00",
    label: "Free Van Rental",
    image:
      "https://plus.unsplash.com/premium_photo-1683140796065-7afb4f679df2?w=200&q=80",
  },
  {
    name: "Funke O.",
    badge: "BRONZE MEMBER",
    badgeColor: "bg-primary-fixed-dim",
    quote:
      "Got a free solar audit and they recommended the perfect system for my flat. I'm saving ₦40k a month on diesel now.",
    amount: "₦0.00",
    label: "Free Solar Audit",
    image:
      "https://plus.unsplash.com/premium_photo-1732464750678-973ff68fbf9d?w=200&q=80",
  },
];

export default function VerifiedInsights() {
  return (
    <section id="insights" className="py-16 md:py-24 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight">
              Members Are Saving Real Money
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Every membership tier comes with free services that pay for
              themselves. Here&apos;s what our members are saying.
            </p>
            <div className="pt-4">
              <div className="text-4xl md:text-5xl font-black text-primary">5</div>
              <div className="text-sm font-bold uppercase tracking-widest text-on-surface-variant pt-2">
                Subsidiaries Serving You
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4">
            {insights.map((item) => (
              <div
                key={item.name}
                className="bg-white p-4 md:p-6 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between group hover:shadow-md transition-shadow gap-4"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <img
                    className="size-12 md:size-16 rounded-full object-cover grayscale flex-shrink-0"
                    alt=""
                    src={item.image}
                    loading="lazy"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-extrabold text-primary">{item.name}</h4>
                      <span
                        className={`text-[10px] ${item.badgeColor} px-2 py-0.5 rounded font-bold`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-xl font-black text-primary">{item.amount}</div>
                  <div className="text-[10px] text-outline font-bold uppercase">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
