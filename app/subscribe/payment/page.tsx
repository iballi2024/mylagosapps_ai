"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Box,
  Stack,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Card,
  Divider,
  Tabs,
  Checkbox,
  CopyButton,
  ActionIcon,
  Tooltip,
  Select,
  Skeleton,
} from "@mantine/core";
import Navbar from "@/components/Navbar";
import {
  apiValidateCoupon,
  apiInitiateCheckout,
  apiVerifyPayment,
  apiGetPlans,
  type SubscriptionPlan,
} from "@/lib/billing";
import { useAuthContext } from "@/context/AuthContext";

type Billing = "annual" | "monthly";

const TIER_META: Record<string, { icon: string; color: string }> = {
  bronze: { icon: "🥉", color: "#6B7C2A" },
  silver: { icon: "🥈", color: "#3D6B5E" },
  gold: { icon: "🥇", color: "#1A6B3C" },
};

const NG_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT — Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
].map((s) => ({ value: s, label: s }));

const COUNTRIES = [{ value: "NG", label: "Nigeria" }];

function StepBar({ step }: { step: number }) {
  const steps = ["Plan", "Payment", "Done"];
  return (
    <Group gap={0} mb="xl" w="100%">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <Box
            key={label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Group gap={0} style={{ width: "100%", alignItems: "center" }}>
              {i > 0 && (
                <Box
                  style={{
                    flex: 1,
                    height: 2,
                    background: done ? "#1A6B3C" : "#D8E6DA",
                  }}
                />
              )}
              <Box
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: done ? "#1A6B3C" : active ? "#1A6B3C" : "#D8E6DA",
                  color: done || active ? "white" : "#4F6B57",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {done ? "✓" : num}
              </Box>
              {i < steps.length - 1 && (
                <Box style={{ flex: 1, height: 2, background: "#D8E6DA" }} />
              )}
            </Group>
            <Text
              size="xs"
              fw={active ? 700 : 400}
              c={active ? "#1A6B3C" : "dimmed"}
            >
              {label}
            </Text>
          </Box>
        );
      })}
    </Group>
  );
}

function PaymentPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const slug = params.get("slug") ?? "silver";
  const billing = (params.get("billing") as Billing) ?? "annual";
  const planId = Number(params.get("planId") ?? 0);
  const billingCycle: "monthly" | "yearly" =
    billing === "annual" ? "yearly" : "monthly";

  const { isAuthenticated, loading: authLoading } = useAuthContext();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const qs = params.toString();
      const returnTo = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`/auth/login?next=${encodeURIComponent(returnTo)}`);
    }
  }, [authLoading, isAuthenticated, pathname, params, router]);

  const [fetchedPlan, setFetchedPlan] = useState<SubscriptionPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState("");
  const [transferRef, setTransferRef] = useState("");

  useEffect(() => {
    setTransferRef(
      `LAGOS-${slug.toUpperCase()}-${Date.now().toString().slice(-6)}`,
    );

    apiGetPlans()
      .then((plans) => {
        const match =
          plans.find((p) => p.id === planId) ??
          plans.find((p) => p.slug === slug) ??
          null;
        setFetchedPlan(match);
      })
      .finally(() => setPlanLoading(false));

    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => setIpAddress(d.ip ?? ""))
      .catch(() => {});

    if (!document.getElementById("paystack-inline-js")) {
      const script = document.createElement("script");
      script.id = "paystack-inline-js";
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [planId, slug]);

  const meta = TIER_META[fetchedPlan?.slug ?? slug] ?? TIER_META.silver;
  const price = fetchedPlan
    ? billing === "annual"
      ? fetchedPlan.priceYearly
      : fetchedPlan.priceMonthly
    : 0;

  const [cardForm, setCardForm] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "NG",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState<
    import("@/lib/billing").CouponResult | null
  >(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const discountAmount = couponApplied?.discountAmount ?? 0;
  const finalPrice = couponApplied?.finalPrice ?? price;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const result = await apiValidateCoupon({
        couponCode: couponCode.trim(),
        planId,
        billingCycle,
      });
      setCouponApplied(result);
    } catch (e) {
      setCouponError(
        e instanceof Error ? e.message : "Invalid or expired coupon code",
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const cardErrors: Record<string, string> = {};
  if (touched.address1 && !cardForm.address1.trim())
    cardErrors.address1 = "Required";
  if (touched.city && !cardForm.city.trim()) cardErrors.city = "Required";
  if (touched.state && !cardForm.state) cardErrors.state = "Required";

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ address1: true, city: true, state: true });

    if (!cardForm.address1.trim() || !cardForm.city.trim() || !cardForm.state) {
      return;
    }

    setCheckoutError(null);
    setLoading(true);

    try {
      // ✅ FIXED: Proper check (no unsafe casting)
      if (!window.PaystackPop) {
        throw new Error(
          "Payment provider not ready. Please wait a moment and try again.",
        );
      }

      const result = await apiInitiateCheckout({
        planId,
        billingCycle,
        billingAddress: cardForm.address1,
        billingState: cardForm.state,
        billingCity: cardForm.city,
        billingCountry: cardForm.country,
        couponCode: couponApplied?.coupon?.code ?? "",
        ipAddress,
      });

      if (!result?.gatewayParams) {
        throw new Error(
          (result as { message?: string })?.message ??
            "Checkout failed. Please try again.",
        );
      }

      const { publicKey, email, amount, reference, metadata } =
        result.gatewayParams;

      // ✅ FIXED: Direct usage, fully typed
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount,
        ref: reference,
        metadata,
        currency: result.currency,

        callback: function (response) {
          (async () => {
            try {
              await apiVerifyPayment({
                orderId: result.orderId,
                transactionId: response.transaction,
                reference: response.reference,
                status: "success",
              });
            } catch (err) {
              console.error("Verify payment error:", err);
            }

            router.push(
              `/subscribe/confirmed?slug=${slug}&reference=${response.reference}`,
            );
          })();
        },

        onClose: () => {
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      setCheckoutError(
        err instanceof Error
          ? err.message
          : "Payment could not be initiated. Please try again.",
      );
      setLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <Box pt={64} style={{ minHeight: "100vh", background: "#F5F8F5" }} />
    );
  }

  return (
    <Box
      pt={64}
      style={{
        minHeight: "100vh",
        background: "#F5F8F5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      px="md"
      py={48}
    >
      <Box w="100%" maw={480}>
        <StepBar step={2} />

        <Stack gap="xs" mb="xl" ta="center">
          <Title
            order={2}
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
          >
            Complete payment
          </Title>
          <Text size="sm" c="dimmed">
            Secure payment · SSL encrypted
          </Text>
        </Stack>

        {/* Order summary */}
        <Card
          withBorder
          radius="xl"
          p="md"
          mb="lg"
          style={{ background: "#EDF3EE", borderColor: "#D8E6DA" }}
        >
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              {planLoading ? (
                <Skeleton height={20} width={160} radius="sm" />
              ) : (
                <>
                  <Text>{meta.icon}</Text>
                  <Text fw={600} style={{ color: meta.color }}>
                    {fetchedPlan?.name ?? slug} Membership
                  </Text>
                </>
              )}
            </Group>
            {planLoading ? (
              <Skeleton height={20} width={80} radius="sm" />
            ) : (
              <Text fw={700}>₦{Math.round(price).toLocaleString()}</Text>
            )}
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {billing === "annual" ? "Billed annually" : "Billed quarterly"}
            </Text>
            <Text size="xs" c="dimmed">
              Next renewal: {billing === "annual" ? "1 year" : "3 months"}
            </Text>
          </Group>

          {/* Coupon */}
          <Divider my="sm" color="#D8E6DA" />
          {couponApplied?.coupon ? (
            <Group justify="space-between" align="center">
              <Group gap={6}>
                <Text size="xs" fw={600} c="teal">
                  🏷 {couponApplied.coupon?.code}
                </Text>
                <Text size="xs" c="dimmed">
                  (
                  {couponApplied.coupon?.type === "percentage"
                    ? `${couponApplied.coupon.value}% off`
                    : `₦${couponApplied.coupon?.value?.toLocaleString()} off`}
                  )
                </Text>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    setCouponApplied(null);
                    setCouponCode("");
                  }}
                  title="Remove coupon"
                >
                  <span style={{ fontSize: 10 }}>✕</span>
                </ActionIcon>
              </Group>
              <Text size="xs" fw={600} c="teal">
                –₦{discountAmount.toLocaleString()}
              </Text>
            </Group>
          ) : (
            <Stack gap={4}>
              <Group gap="xs" align="flex-start">
                <TextInput
                  placeholder="Coupon code"
                  size="xs"
                  radius="md"
                  style={{ flex: 1 }}
                  value={couponCode}
                  error={couponError}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                  styles={{
                    input: {
                      background: "white",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    },
                  }}
                />
                <Button
                  size="xs"
                  radius="md"
                  variant="light"
                  color="teal"
                  loading={couponLoading}
                  disabled={!couponCode.trim()}
                  style={{ marginTop: 1 }}
                  onClick={handleApplyCoupon}
                >
                  Apply
                </Button>
              </Group>
            </Stack>
          )}

          <Divider my="sm" color="#D8E6DA" />
          <Group justify="space-between">
            <Text fw={700} style={{ fontFamily: "var(--font-montserrat)" }}>
              Total
            </Text>
            <Box ta="right">
              {discountAmount > 0 && (
                <Text size="xs" td="line-through" c="dimmed">
                  ₦{price?.toLocaleString()}
                </Text>
              )}
              <Text
                fw={800}
                style={{
                  color: "#1A6B3C",
                  fontSize: 20,
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                ₦{finalPrice?.toLocaleString()}
              </Text>
            </Box>
          </Group>
        </Card>

        {/* Payment method tabs */}
        <Tabs defaultValue="card" radius="md">
          <Tabs.List mb="md" style={{ borderColor: "#D8E6DA" }}>
            <Tabs.Tab value="card" fw={600}>
              💳 Card
            </Tabs.Tab>
            <Tabs.Tab value="transfer" fw={600}>
              🏦 Bank Transfer
            </Tabs.Tab>
          </Tabs.List>

          {/* Card tab */}
          <Tabs.Panel value="card">
            <form onSubmit={handleCardSubmit} noValidate>
              <Stack gap="md">
                <Text
                  size="xs"
                  fw={700}
                  tt="uppercase"
                  c="dimmed"
                  style={{ letterSpacing: 1 }}
                >
                  Billing Address
                </Text>
                <TextInput
                  label="Street address"
                  placeholder="12 Broad Street"
                  radius="md"
                  required
                  value={cardForm.address1}
                  error={cardErrors.address1}
                  onChange={(e) =>
                    setCardForm((p) => ({ ...p, address1: e.target.value }))
                  }
                  onBlur={() => setTouched((p) => ({ ...p, address1: true }))}
                />
                <TextInput
                  label="City"
                  placeholder="Lagos"
                  radius="md"
                  required
                  value={cardForm.city}
                  error={cardErrors.city}
                  onChange={(e) =>
                    setCardForm((p) => ({ ...p, city: e.target.value }))
                  }
                  onBlur={() => setTouched((p) => ({ ...p, city: true }))}
                />
                <Group grow>
                  <Select
                    label="State"
                    placeholder="Select state"
                    radius="md"
                    required
                    data={NG_STATES}
                    searchable
                    value={cardForm.state}
                    error={cardErrors.state}
                    onChange={(v) => {
                      setCardForm((p) => ({ ...p, state: v ?? "" }));
                      setTouched((p) => ({ ...p, state: true }));
                    }}
                  />
                  <Select
                    label="Country"
                    radius="md"
                    required
                    data={COUNTRIES}
                    value={cardForm.country}
                    onChange={(v) =>
                      setCardForm((p) => ({ ...p, country: v ?? "NG" }))
                    }
                  />
                </Group>

                {checkoutError && (
                  <Text size="sm" c="red" ta="center">
                    {checkoutError}
                  </Text>
                )}
                <Button
                  type="submit"
                  fullWidth
                  radius="xl"
                  size="lg"
                  fw={700}
                  loading={loading}
                  style={{
                    background: "linear-gradient(135deg, #2E9E5B, #3DA96E)",
                    color: "white",
                  }}
                >
                  🔒 Pay ₦{finalPrice?.toLocaleString()}
                </Button>
                <Text ta="center" size="xs" c="dimmed">
                  Your card is charged immediately. Membership activates on
                  payment.
                </Text>
              </Stack>
            </form>
          </Tabs.Panel>

          {/* Bank transfer tab */}
          <Tabs.Panel value="transfer">
            <Stack gap="md">
              <Card
                withBorder
                radius="xl"
                p="lg"
                style={{ background: "#EDF3EE" }}
              >
                <Text
                  size="xs"
                  tt="uppercase"
                  fw={700}
                  c="dimmed"
                  mb="md"
                  style={{ letterSpacing: 1 }}
                >
                  Transfer to
                </Text>
                <Stack gap="sm">
                  {[
                    { label: "Bank", value: "GTBank (Guaranty Trust Bank)" },
                    {
                      label: "Account name",
                      value: "LagosApps Technologies Ltd",
                    },
                    {
                      label: "Account number",
                      value: "0123456789",
                      copy: true,
                    },
                    {
                      label: "Amount",
                      value: `₦${finalPrice?.toLocaleString()}`,
                    },
                    { label: "Reference", value: transferRef, copy: true },
                  ].map((row) => (
                    <Group key={row.label} justify="space-between">
                      <Text size="sm" c="dimmed">
                        {row.label}
                      </Text>
                      <Group gap="xs">
                        <Text size="sm" fw={600}>
                          {row.value}
                        </Text>
                        {row.copy && (
                          <CopyButton value={row.value}>
                            {({ copied, copy }) => (
                              <Tooltip
                                label={copied ? "Copied!" : "Copy"}
                                withArrow
                              >
                                <ActionIcon
                                  size="sm"
                                  variant="subtle"
                                  onClick={copy}
                                  color={copied ? "teal" : "gray"}
                                >
                                  <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 14 }}
                                  >
                                    {copied ? "check" : "content_copy"}
                                  </span>
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </CopyButton>
                        )}
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>

              <Text size="xs" c="dimmed" ta="center">
                Include the reference code in your transfer narration. Your
                membership activates within 30 minutes of payment confirmation.
              </Text>

              <Checkbox
                label="I have completed the bank transfer"
                radius="sm"
                color="#1A6B3C"
                checked={transferConfirmed}
                onChange={(e) => setTransferConfirmed(e.currentTarget.checked)}
              />

              <Button
                fullWidth
                radius="xl"
                size="lg"
                fw={700}
                disabled={!transferConfirmed}
                style={
                  transferConfirmed
                    ? {
                        background: "linear-gradient(135deg, #2E9E5B, #3DA96E)",
                        color: "white",
                      }
                    : {}
                }
                onClick={() => router.push(`/subscribe/confirmed?slug=${slug}`)}
              >
                I&apos;ve paid — Activate my membership →
              </Button>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <Box pt={64} style={{ minHeight: "100vh", background: "#F5F8F5" }} />
        }
      >
        <PaymentPageInner />
      </Suspense>
    </>
  );
}
