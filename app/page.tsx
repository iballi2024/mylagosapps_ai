"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Stack,
  Group,
  Grid,
  Text,
  Title,
  Badge,
  Button,
  Card,
  TextInput,
  Divider,
  ActionIcon,
  SegmentedControl,
  Anchor,
  Container,
  SimpleGrid,
  Paper,
  Flex,
  Indicator,
} from "@mantine/core";
import {
  usePlatform,
  SUBSIDIARIES,
  Subsidiary,
} from "@/context/PlatformContext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const QUICK_LINKS = [
  { label: "Order food", icon: "🍽️", href: "/services/food" },
  { label: "Book a ride", icon: "🚗", href: "/services/rides" },
  { label: "Send a parcel", icon: "📦", href: "/services/logistics" },
  { label: "Buy groceries", icon: "🛒", href: "/services/groceries" },
  { label: "Home cleaning", icon: "🧽", href: "/services/home" },
  { label: "Get medicine", icon: "💊", href: "/services/healthcare" },
];

const MEMBERSHIP_PLANS = [
  {
    tier: "Bronze",
    icon: "🥉",
    monthlyPrice: 4999,
    annualPrice: 47990,
    annualMonthly: 3999,
    color: "#A0521A",
    colorLight: "#C87433",
    colorPale: "#FDF0E6",
    tagline: "Everyday savings for regular users",
    discounts: {
      monthly: [
        { label: "Food delivery", saving: "5% off every order" },
        { label: "Rides", saving: "5% off every trip" },
        { label: "Parcels", saving: "₦200 off intra-city" },
      ],
      annual: [
        { label: "Food delivery", saving: "7% off every order" },
        { label: "Rides", saving: "7% off every trip" },
        { label: "Parcels", saving: "₦300 off intra-city" },
      ],
    },
    perks: {
      monthly: [
        "Priority WhatsApp response",
        "Free delivery — first 3 orders/month",
        "1.5× loyalty points",
      ],
      annual: [
        "Priority WhatsApp response",
        "Free delivery — first 5 orders/month",
        "2× loyalty points",
        "Annual member badge",
      ],
    },
  },
  {
    tier: "Silver",
    icon: "🥈",
    monthlyPrice: 12999,
    annualPrice: 124790,
    annualMonthly: 10399,
    color: "#4A5568",
    colorLight: "#6B7A8D",
    colorPale: "#EEF1F5",
    tagline: "Deeper discounts for frequent buyers",
    discounts: {
      monthly: [
        { label: "Food delivery", saving: "10% off every order" },
        { label: "Rides", saving: "10% off every trip" },
        { label: "Groceries", saving: "8% off all orders" },
        { label: "Parcels", saving: "₦500 off intra-city" },
        { label: "Home services", saving: "5% off bookings" },
      ],
      annual: [
        { label: "Food delivery", saving: "12% off every order" },
        { label: "Rides", saving: "12% off every trip" },
        { label: "Groceries", saving: "10% off all orders" },
        { label: "Parcels", saving: "₦700 off intra-city" },
        { label: "Home services", saving: "8% off bookings" },
      ],
    },
    perks: {
      monthly: [
        "Dedicated support line",
        "Free delivery × 8 orders/month",
        "2× loyalty points",
        "Early access to new services",
      ],
      annual: [
        "Dedicated support line",
        "Free delivery × 12 orders/month",
        "2.5× loyalty points",
        "Early access to new services",
        "Annual member badge",
      ],
    },
  },
  {
    tier: "Gold",
    icon: "🥇",
    popular: true,
    monthlyPrice: 29999,
    annualPrice: 287990,
    annualMonthly: 23999,
    color: "#C9920A",
    colorLight: "#E5A811",
    colorPale: "#FEF7E6",
    tagline: "Maximum value for power users & businesses",
    discounts: {
      monthly: [
        { label: "Food delivery", saving: "15% off every order" },
        { label: "Rides", saving: "15% off every trip" },
        { label: "Groceries", saving: "12% off all orders" },
        { label: "Parcels", saving: "Free intra-city × 10/month" },
        { label: "Home services", saving: "10% off all bookings" },
        { label: "Healthcare", saving: "10% off consultations" },
      ],
      annual: [
        { label: "Food delivery", saving: "20% off every order" },
        { label: "Rides", saving: "20% off every trip" },
        { label: "Groceries", saving: "15% off all orders" },
        { label: "Parcels", saving: "Free intra-city × 20/month" },
        { label: "Home services", saving: "15% off all bookings" },
        { label: "Healthcare", saving: "15% off consultations" },
      ],
    },
    perks: {
      monthly: [
        "24/7 dedicated account manager",
        "Unlimited free delivery — food & groceries",
        "3× loyalty points",
        "Business invoicing & reports",
        "Priority booking on all services",
      ],
      annual: [
        "24/7 dedicated account manager",
        "Unlimited free delivery — food & groceries",
        "4× loyalty points",
        "Business invoicing & reports",
        "Priority booking on all services",
        "Gold member certificate",
        "Exclusive partner offers",
      ],
    },
  },
];

type Billing = "monthly" | "annual";

export default function HomePage() {
  const { walletBalance, loyaltyPoints, formatPrice } = usePlatform();
  const [search, setSearch] = useState("");
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [billing, setBilling] = useState<Billing>("monthly");

  const filtered = search.trim()
    ? SUBSIDIARIES.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.category.toLowerCase().includes(search.toLowerCase()) ||
          s.services.some((sv) =>
            sv.name.toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : SUBSIDIARIES;

  return (
    <>
      <Navbar />
      <Box
        pt={64}
        style={{ minHeight: "100vh", background: "var(--color-bg)" }}
      >
        {/* ── Hero ── */}
        <Box bg="var(--color-ink)" c="white" px="md" pt={48} pb={40}>
          <Container size="lg">
            <Text size="sm" c="white" opacity={0.5} mb={4}>
              Welcome back, Chidi
            </Text>
            <Title
              order={1}
              ff="var(--font-montserrat)"
              fw={800}
              fz={{ base: 28, md: 36 }}
              mb={24}
              lh={1.15}
            >
              What do you need today?
            </Title>

            {/* Wallet + loyalty */}
            <Group gap="md" mb={32} wrap="wrap">
              <Paper
                p="sm"
                radius="xl"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Group gap="md">
                  <Box>
                    <Text
                      size="xs"
                      c="white"
                      opacity={0.5}
                      tt="uppercase"
                      fw={600}
                      style={{ letterSpacing: 1 }}
                    >
                      Wallet Balance
                    </Text>
                    <Title
                      order={3}
                      ff="var(--font-montserrat)"
                      c="white"
                      fw={700}
                    >
                      {formatPrice(walletBalance)}
                    </Title>
                  </Box>
                  <Button
                    component={Link}
                    href="/wallet"
                    size="xs"
                    radius="lg"
                    style={{ background: "var(--color-gold)", color: "white" }}
                  >
                    Top Up
                  </Button>
                </Group>
              </Paper>
              <Paper
                p="sm"
                radius="xl"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Group gap="xs">
                  <Text fz={20}>⭐</Text>
                  <Box>
                    <Text
                      size="xs"
                      c="white"
                      opacity={0.5}
                      tt="uppercase"
                      fw={600}
                      style={{ letterSpacing: 1 }}
                    >
                      Loyalty Points
                    </Text>
                    <Title
                      order={4}
                      ff="var(--font-montserrat)"
                      c="white"
                      fw={700}
                    >
                      {loyaltyPoints.toLocaleString()} pts
                    </Title>
                  </Box>
                </Group>
              </Paper>
            </Group>

            {/* Quick links */}
            <SimpleGrid cols={{ base: 3, md: 6 }} spacing="xs">
              {QUICK_LINKS.map((q) => (
                <Box
                  key={q.href}
                  component={Link}
                  href={q.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 8px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.08)")
                  }
                >
                  <Text fz={24}>{q.icon}</Text>
                  <Text
                    size="xs"
                    c="white"
                    opacity={0.7}
                    ta="center"
                    lh={1.3}
                    fw={500}
                  >
                    {q.label}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* ── Service directory ── */}
        <Container size="lg" px="md" py={40}>
          <Group justify="space-between" mb="lg" wrap="wrap" gap="sm">
            <Title order={2} ff="var(--font-montserrat)" fw={700} fz={22}>
              All Services
            </Title>
            <TextInput
              placeholder="Search services…"
              leftSection="🔍"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              radius="xl"
              w={210}
            />
          </Group>

          {filtered.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {filtered.map((sub) => (
                <SubsidiaryCard
                  key={sub.id}
                  sub={sub}
                  formatPrice={formatPrice}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Stack align="center" py={64} gap="sm">
              <Text fz={40}>🔍</Text>
              <Text fw={600} c="var(--color-ink)">
                No services found for &ldquo;{search}&rdquo;
              </Text>
              <Anchor
                size="sm"
                c="var(--color-gold)"
                onClick={() => setSearch("")}
              >
                Clear search
              </Anchor>
            </Stack>
          )}
        </Container>

        {/* ── WhatsApp strip ── */}
        <Box
          style={{
            background: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
          }}
          px="md"
          py={32}
        >
          <Container size="lg">
            <Group justify="space-between" wrap="wrap" gap="md">
              <Group gap="md">
                <Box
                  w={48}
                  h={48}
                  style={{
                    background: "#25D366",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  💬
                </Box>
                <Box>
                  <Text fw={700} ff="var(--font-montserrat)" size="sm">
                    Prefer to order on WhatsApp?
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    All services available via WhatsApp. Get receipts and
                    updates on the same chat.
                  </Text>
                </Box>
              </Group>
              <Button
                component="a"
                href="https://wa.me/2348001000000"
                target="_blank"
                radius="xl"
                size="sm"
                leftSection="💬"
                style={{ background: "#25D366", color: "white", flexShrink: 0 }}
              >
                Order on WhatsApp
              </Button>
            </Group>
          </Container>
        </Box>

        {/* ── Membership Plans ── */}
        <Box
          id="membership"
          style={{
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-bg)",
          }}
          px="md"
          py={56}
        >
          <Container size="lg">
            <Stack align="center" mb={40} gap="sm">
              <Badge
                variant="outline"
                color="yellow"
                radius="xl"
                tt="uppercase"
                fw={700}
                style={{
                  letterSpacing: 3,
                  borderColor: "var(--color-gold)",
                  color: "var(--color-gold)",
                }}
              >
                ⭐ Membership Plans
              </Badge>
              <Title
                order={2}
                ff="var(--font-montserrat)"
                fw={800}
                fz={{ base: 24, md: 32 }}
                ta="center"
              >
                Save more on every order
              </Title>
              <Text size="sm" c="dimmed" maw={500} ta="center" lh={1.7}>
                Subscribe to a LagosApps membership and unlock instant discounts
                across food, rides, groceries, logistics, home services, and
                healthcare.
              </Text>

              {/* Billing toggle */}
              <Box mt={8}>
                <SegmentedControl
                  value={billing}
                  onChange={(v) => setBilling(v as Billing)}
                  radius="xl"
                  size="sm"
                  data={[
                    { label: "Monthly", value: "monthly" },
                    {
                      label: (
                        <Group gap={6} wrap="nowrap">
                          <span>Annual</span>
                          <Badge
                            size="xs"
                            radius="xl"
                            style={{
                              background:
                                billing === "annual"
                                  ? "var(--color-gold)"
                                  : "var(--color-gold-pale)",
                              color:
                                billing === "annual"
                                  ? "white"
                                  : "var(--color-gold)",
                            }}
                          >
                            2 months free
                          </Badge>
                        </Group>
                      ) as any,
                      value: "annual",
                    },
                  ]}
                  styles={{
                    root: {
                      background: "white",
                      border: "1px solid var(--color-border)",
                    },
                    indicator: { background: "var(--color-ink)" },
                    label: { color: "var(--color-muted)" },
                    labelActive: { color: "white" },
                  }}
                />
              </Box>

              {billing === "annual" && (
                <Text size="xs" c="var(--color-gold)" fw={600}>
                  🎉 You save up to ₦71,998 per year with an annual plan
                </Text>
              )}
            </Stack>

            {/* Plan cards */}
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb={24}>
              {MEMBERSHIP_PLANS.map((plan) => {
                const isOpen = activePlan === plan.tier;
                const displayPrice =
                  billing === "monthly"
                    ? plan.monthlyPrice
                    : plan.annualMonthly;
                const billedAmount =
                  billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
                const activeDiscounts = plan.discounts[billing];
                const activePerks = plan.perks[billing];
                const annualSaving = plan.monthlyPrice * 12 - plan.annualPrice;

                return (
                  <Card
                    key={plan.tier}
                    withBorder
                    radius="xl"
                    p={0}
                    style={{
                      border: `1px solid ${isOpen || plan.popular ? plan.color + "50" : "var(--color-border)"}`,
                      boxShadow: isOpen
                        ? "0 8px 32px rgba(0,0,0,0.10)"
                        : "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
                      transform: isOpen ? "translateY(-4px)" : undefined,
                      transition: "all 0.25s",
                      outline: plan.popular
                        ? `2px solid ${plan.color}40`
                        : undefined,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Top bar */}
                    <Box
                      h={6}
                      style={{
                        background: `linear-gradient(90deg, ${plan.color}, ${plan.colorLight})`,
                      }}
                    />

                    {plan.popular && (
                      <Badge
                        size="xs"
                        fw={700}
                        tt="uppercase"
                        style={{
                          letterSpacing: 2,
                          background: plan.color,
                          color: "white",
                          position: "absolute",
                          top: 20,
                          right: 16,
                        }}
                      >
                        Best Value
                      </Badge>
                    )}

                    <Stack p="lg" gap="md">
                      {/* Header */}
                      <Group gap="sm">
                        <Box
                          w={44}
                          h={44}
                          style={{
                            background: plan.colorPale,
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                            flexShrink: 0,
                          }}
                        >
                          {plan.icon}
                        </Box>
                        <Box>
                          <Text
                            fw={700}
                            ff="var(--font-montserrat)"
                            style={{ color: plan.color }}
                            lh={1.2}
                          >
                            {plan.tier}
                          </Text>
                          <Text size="xs" c="dimmed" lh={1.3}>
                            {plan.tagline}
                          </Text>
                        </Box>
                      </Group>

                      {/* Price */}
                      <Box>
                        <Group gap={6} align="flex-end">
                          <Title
                            order={2}
                            ff="var(--font-montserrat)"
                            fw={800}
                            lh={1}
                            c="var(--color-ink)"
                          >
                            <Text
                              span
                              fz="xl"
                              style={{ color: plan.color }}
                              ff="var(--font-montserrat)"
                            >
                              ₦
                            </Text>
                            {displayPrice.toLocaleString()}
                          </Title>
                          <Text size="xs" c="dimmed" mb={2}>
                            / month
                          </Text>
                        </Group>
                        {billing === "annual" ? (
                          <Group gap={6} mt={6} wrap="wrap">
                            <Text size="xs" c="dimmed">
                              Billed{" "}
                              <Text span fw={600} c="var(--color-ink)">
                                ₦{billedAmount.toLocaleString()}
                              </Text>
                              /year
                            </Text>
                            <Badge
                              size="xs"
                              radius="xl"
                              style={{
                                background: plan.colorPale,
                                color: plan.color,
                              }}
                            >
                              Save ₦{annualSaving.toLocaleString()}
                            </Badge>
                          </Group>
                        ) : (
                          <Text size="xs" c="dimmed" mt={6}>
                            or{" "}
                            <Anchor
                              size="xs"
                              fw={600}
                              style={{ color: plan.color }}
                              onClick={() => setBilling("annual")}
                            >
                              save ₦{annualSaving.toLocaleString()} annually
                            </Anchor>
                          </Text>
                        )}
                      </Box>

                      <Divider />

                      {/* Discounts */}
                      <Box>
                        <Group gap={6} mb={10}>
                          <Text
                            size="xs"
                            tt="uppercase"
                            fw={700}
                            c="dimmed"
                            style={{ letterSpacing: 1.5 }}
                          >
                            Discounts included
                          </Text>
                          {billing === "annual" && (
                            <Badge
                              size="xs"
                              radius="xl"
                              style={{
                                background: plan.colorPale,
                                color: plan.color,
                              }}
                            >
                              Enhanced
                            </Badge>
                          )}
                        </Group>
                        <Stack gap={6}>
                          {activeDiscounts.map((d) => (
                            <Group
                              key={d.label}
                              gap={8}
                              wrap="nowrap"
                              align="flex-start"
                            >
                              <Box
                                w={14}
                                h={14}
                                style={{
                                  background: plan.colorPale,
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  marginTop: 2,
                                }}
                              >
                                <Text
                                  size="xs"
                                  style={{
                                    color: plan.color,
                                    fontSize: 9,
                                    fontWeight: 700,
                                  }}
                                >
                                  ✓
                                </Text>
                              </Box>
                              <Text size="xs" c="dimmed">
                                <Text span fw={600} c="var(--color-ink)">
                                  {d.label}
                                </Text>{" "}
                                — {d.saving}
                              </Text>
                            </Group>
                          ))}
                        </Stack>
                      </Box>

                      {/* Perks toggle */}
                      <Button
                        variant="subtle"
                        size="xs"
                        px={0}
                        onClick={() => setActivePlan(isOpen ? null : plan.tier)}
                        style={{
                          color: plan.color,
                          width: "fit-content",
                          alignSelf: "flex-start",
                        }}
                        leftSection={
                          <Text
                            span
                            style={{
                              transition: "transform 0.2s",
                              display: "inline-block",
                              transform: isOpen ? "rotate(180deg)" : "none",
                            }}
                          >
                            ▼
                          </Text>
                        }
                      >
                        {isOpen ? "Hide" : "Show"} member perks
                      </Button>

                      {isOpen && (
                        <Paper
                          p="sm"
                          radius="md"
                          style={{
                            background: plan.colorPale,
                            border: `1px solid ${plan.color}25`,
                          }}
                        >
                          <Group gap={6} mb={8}>
                            <Text
                              size="xs"
                              tt="uppercase"
                              fw={700}
                              style={{ letterSpacing: 1.5, color: plan.color }}
                            >
                              Member perks
                            </Text>
                            {billing === "annual" && (
                              <Text
                                size="xs"
                                style={{ color: plan.color }}
                                fw={600}
                              >
                                — Annual extras ✦
                              </Text>
                            )}
                          </Group>
                          <Stack gap={6}>
                            {activePerks.map((perk, i) => {
                              const isAnnualBonus =
                                billing === "annual" &&
                                !plan.perks.monthly.includes(perk);
                              return (
                                <Group
                                  key={i}
                                  gap={8}
                                  wrap="nowrap"
                                  align="flex-start"
                                >
                                  <Text
                                    size="xs"
                                    style={{
                                      color: plan.color,
                                      flexShrink: 0,
                                      marginTop: 1,
                                    }}
                                  >
                                    {isAnnualBonus ? "✦" : "★"}
                                  </Text>
                                  <Text
                                    size="xs"
                                    fw={isAnnualBonus ? 600 : 400}
                                    c={isAnnualBonus ? plan.color : "dimmed"}
                                  >
                                    {perk}
                                    {isAnnualBonus && " (annual only)"}
                                  </Text>
                                </Group>
                              );
                            })}
                          </Stack>
                        </Paper>
                      )}

                      {/* CTA */}
                      <Button
                        component={Link}
                        href="/subscribe/account"
                        radius="xl"
                        fullWidth
                        fw={700}
                        style={
                          plan.popular
                            ? { background: plan.color, color: "white" }
                            : {
                                background: plan.colorPale,
                                color: plan.color,
                                border: `1.5px solid ${plan.color}30`,
                              }
                        }
                      >
                        Subscribe —{" "}
                        {billing === "annual"
                          ? `₦${plan.annualPrice.toLocaleString()}/yr`
                          : `₦${plan.monthlyPrice.toLocaleString()}/mo`}{" "}
                        →
                      </Button>
                    </Stack>
                  </Card>
                );
              })}
            </SimpleGrid>

            <Text ta="center" size="xs" c="dimmed">
              {billing === "monthly"
                ? "Membership fees charged monthly to your wallet. Cancel anytime."
                : "Annual plans charged once. Non-refundable after 7 days."}{" "}
              <Anchor
                size="xs"
                c="var(--color-gold)"
                fw={600}
                onClick={() =>
                  setBilling(billing === "monthly" ? "annual" : "monthly")
                }
              >
                Switch to {billing === "monthly" ? "annual" : "monthly"} →
              </Anchor>
            </Text>
          </Container>
        </Box>

        {/* ── Trust signals ── */}
        <Box
          style={{
            background: "var(--color-surface2)",
            borderTop: "1px solid var(--color-border)",
          }}
          px="md"
          py={32}
        >
          <Container size="lg">
            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="lg">
              {[
                {
                  icon: "👜",
                  stat: "1 account",
                  desc: "Works across all services",
                },
                {
                  icon: "💳",
                  stat: "1 wallet",
                  desc: "Pay once, use everywhere",
                },
                {
                  icon: "🔒",
                  stat: "Secure",
                  desc: "256-bit SSL on all transactions",
                },
                { icon: "🇳🇬", stat: "Naira only", desc: "No FX charges, ever" },
              ].map((t) => (
                <Stack key={t.stat} align="center" gap={4}>
                  <Text fz={28}>{t.icon}</Text>
                  <Text fw={700} ff="var(--font-montserrat)" size="sm">
                    {t.stat}
                  </Text>
                  <Text size="xs" c="dimmed" ta="center">
                    {t.desc}
                  </Text>
                </Stack>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      </Box>
    </>
  );
}

function SubsidiaryCard({
  sub,
  formatPrice,
}: {
  sub: Subsidiary;
  formatPrice: (n: number) => string;
}) {
  const router = useRouter();
  const lowestPrice = Math.min(...sub.services.map((s) => s.startingPrice));
  return (
    <Card
      onClick={() => router.push(`/services/${sub.slug}`)}
      withBorder
      radius="xl"
      p={0}
      style={{
        textDecoration: "none",
        overflow: "hidden",
        transition: "all 0.2s",
        border: "1px solid var(--color-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <Box
        h={6}
        style={{
          background: `linear-gradient(90deg, ${sub.color}, ${sub.colorLight})`,
        }}
      />
      <Box p="md">
        <Group justify="space-between" mb="sm">
          <Group gap="sm">
            <Box
              w={44}
              h={44}
              style={{
                background: sub.colorPale,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {sub.icon}
            </Box>
            <Box>
              <Text
                fw={700}
                ff="var(--font-montserrat)"
                style={{ color: sub.color }}
              >
                {sub.name}
              </Text>
              <Text
                size="xs"
                c="dimmed"
                tt="uppercase"
                fw={600}
                style={{ letterSpacing: 1 }}
              >
                {sub.category}
              </Text>
            </Box>
          </Group>
          <Box ta="right">
            <Text size="xs" c="dimmed">
              From
            </Text>
            <Text fw={700} ff="var(--font-montserrat)" size="sm">
              {formatPrice(lowestPrice)}
            </Text>
          </Box>
        </Group>

        <Text size="sm" c="dimmed" mb="sm" lh={1.6}>
          {sub.tagline}
        </Text>

        <Group gap={6} mb="sm" wrap="wrap">
          {sub.services.map((sv) => (
            <Badge
              key={sv.id}
              size="sm"
              radius="xl"
              variant={sv.popular ? "filled" : "light"}
              style={
                sv.popular
                  ? { background: sub.color, color: "white" }
                  : {
                      background: "var(--color-surface2)",
                      color: "var(--color-muted)",
                      border: "1px solid var(--color-border)",
                    }
              }
            >
              {sv.popular ? `★ ${sv.name}` : sv.name}
            </Badge>
          ))}
        </Group>

        <Divider mb="sm" />

        <Group justify="space-between">
          <Anchor
            href={`https://wa.me/${sub.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            size="xs"
            fw={600}
            c="#25D366"
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            💬 WhatsApp order
          </Anchor>
          <Text size="xs" fw={600} style={{ color: sub.color }}>
            Order now →
          </Text>
        </Group>
      </Box>
    </Card>
  );
}
