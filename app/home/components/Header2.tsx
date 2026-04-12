"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Group,
  Text,
  Anchor,
  Button,
  ActionIcon,
  Avatar,
  Indicator,
  Menu,
  Drawer,
  Accordion,
  ScrollArea,
  UnstyledButton,
  Stack,
  Divider,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconBell,
  IconMenu2,
  IconX,
  IconBrandWhatsapp,
  IconUser,
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react";
import { useAuth } from "../hooks/useAuth";
import Logo from "@/components/Logo";
import { useNotifications } from "@/context/NotificationsContext";

const serviceCategories = [
  { name: "Food, Groceries and Household", icon: "restaurant",       href: "/services/food"       },
  { name: "Cars, Vans and Rides",          icon: "directions_car",   href: "/services/rides"      },
  { name: "Health and Wellness",           icon: "health_and_safety", href: "/services/healthcare" },
  { name: "Events and Studios",            icon: "celebration",      href: "/services/events"     },
  { name: "Solar, Renewables and More",    icon: "solar_power",      href: "/services/solar"      },
  { name: "Office and School",             icon: "business_center",  href: "/services/office"     },
];

const navLinks = [
  { label: "About",    href: "/about" },
  { label: "FAQ",      href: "/#faq"  },
];

export default function Header2() {
  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const userInitials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <>
      {/* ── Sticky header ─────────────────────────────────────────────── */}
      <Box
        component="header"
        pos="sticky"
        top={0}
        style={{
          zIndex: 50,
          height: 64,
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${scrolled ? "var(--color-border)" : "transparent"}`,
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
          transition: "background 200ms, border-color 200ms, box-shadow 200ms",
        }}
        px={{ base: "md", md: "xl" }}
      >
        <Group h="100%" justify="space-between" maw={1200} mx="auto">

          {/* Logo */}
          <Anchor href="/" underline="never" style={{ flexShrink: 0 }}>
            <Logo size="1.2rem" />
          </Anchor>

          {/* Desktop centre nav */}
          <Group gap="xs" visibleFrom="md" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>

            {/* Services dropdown */}
            <Menu shadow="lg" radius="lg" width={280} trigger="hover" openDelay={80} closeDelay={120}>
              <Menu.Target>
                <UnstyledButton style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "6px 12px", borderRadius: 8,
                  fontSize: 14, fontWeight: 600, color: "var(--color-ink)",
                  transition: "background 150ms",
                }}>
                  Services
                  <IconChevronDown size={14} stroke={2.5} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown py={6}>
                {serviceCategories.map((cat) => (
                  <Menu.Item
                    key={cat.name}
                    component="a"
                    href={cat.href}
                    leftSection={
                      <Box style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "#E8F5EE",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#2E9E5B" }}>
                          {cat.icon}
                        </span>
                      </Box>
                    }
                    style={{ borderRadius: 8, padding: "8px 10px" }}
                  >
                    <Text size="sm" fw={500}>{cat.name}</Text>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            {navLinks.map((link) => (
              <Anchor
                key={link.label}
                href={link.href}
                underline="never"
                style={{
                  padding: "6px 12px", borderRadius: 8,
                  fontSize: 14, fontWeight: 600, color: "var(--color-ink)",
                  transition: "background 150ms",
                }}
              >
                {link.label}
              </Anchor>
            ))}
          </Group>

          {/* Right actions */}
          <Group gap="xs" style={{ flexShrink: 0 }}>

            {!loading && isAuthenticated && user ? (
              <>
                {/* Bell */}
                <Indicator
                  label={unreadCount > 99 ? "99+" : String(unreadCount)}
                  size={16}
                  color="red"
                  offset={4}
                  disabled={unreadCount === 0}
                  visibleFrom="md"
                >
                  <ActionIcon
                    component="a"
                    href="/dashboard/notifications"
                    variant="subtle"
                    size={38}
                    radius="xl"
                    color="gray"
                    aria-label="Notifications"
                  >
                    <IconBell size={20} />
                  </ActionIcon>
                </Indicator>

                {/* Avatar menu */}
                <Menu shadow="lg" radius="lg" width={200} position="bottom-end" offset={8} 
                // visibleFrom="md"
                >
                  <Menu.Target>
                    <UnstyledButton aria-label="Account menu" title={`${user.firstName} ${user.lastName}`}>
                      <Avatar
                        src={user.avatar || undefined}
                        alt={userInitials}
                        size={36}
                        radius="xl"
                        color="green"
                        style={{ cursor: "pointer", outline: "2px solid transparent", transition: "outline 150ms" }}
                      >
                        {userInitials}
                      </Avatar>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Box px="sm" py="xs" mb={4}>
                      <Text size="sm" fw={700} c="var(--color-ink)" lineClamp={1}>
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>{user.email}</Text>
                    </Box>
                    <Divider mb={4} />
                    <Menu.Item component="a" href="/dashboard" leftSection={<IconLayoutDashboard size={16} />}>
                      Dashboard
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={16} />}
                      onClick={() => logout().catch(() => {})}
                    >
                      Log out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : !loading ? (
              <>
                <ActionIcon
                  component="a"
                  href="/auth/login"
                  variant="default"
                  size={38}
                  radius="xl"
                  aria-label="Sign in"
                  visibleFrom="md"
                >
                  <IconUser size={18} />
                </ActionIcon>
                <Button
                  component="a"
                  href="/subscribe/plan"
                  size="sm"
                  radius="xl"
                  fw={700}
                  visibleFrom="md"
                  style={{ background: "linear-gradient(135deg, #2E9E5B, #1A6B3C)", color: "white" }}
                >
                  Subscribe
                </Button>
              </>
            ) : null}

            {/* Mobile hamburger */}
            <ActionIcon
              variant="subtle"
              size={40}
              radius="xl"
              hiddenFrom="md"
              color="gray"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu2 size={22} />
            </ActionIcon>
          </Group>

        </Group>
      </Box>

      {/* ── Mobile Drawer ──────────────────────────────────────────────── */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
        size="85%"
        padding={0}
        withCloseButton={false}
        zIndex={9999}
        styles={{ body: { padding: 0 } }}
      >
        {/* Drawer header */}
        <Group
          justify="space-between"
          px="md"
          h={64}
          style={{ borderBottom: "1px solid var(--color-border)", flexShrink: 0 }}
        >
          <Anchor href="/" underline="never" onClick={() => setDrawerOpen(false)}>
            <Logo size="1.2rem" />
          </Anchor>
          <ActionIcon
            variant="subtle"
            size={40}
            radius="xl"
            color="gray"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <IconX size={20} />
          </ActionIcon>
        </Group>

        {/* Drawer body */}
        <ScrollArea h="calc(100dvh - 64px)" px="md" py="md">
          <Stack gap={0}>

            {/* Services accordion */}
            <Accordion
              variant="default"
              chevron={<IconChevronDown size={16} />}
              styles={{
                control: { paddingLeft: 0, paddingRight: 0 },
                label:   { fontWeight: 600, fontSize: 15, color: "var(--color-ink)" },
                item:    { borderBottom: "1px solid var(--color-border)" },
                content: { paddingLeft: 0, paddingRight: 0 },
              }}
            >
              <Accordion.Item value="services">
                <Accordion.Control>Services</Accordion.Control>
                <Accordion.Panel>
                  <Stack gap={2} pb="sm">
                    {serviceCategories.map((cat) => (
                      <Anchor
                        key={cat.name}
                        href={cat.href}
                        underline="never"
                        onClick={() => setDrawerOpen(false)}
                      >
                        <Group
                          gap="sm"
                          p="sm"
                          style={{ borderRadius: 10 }}
                          className="hover:bg-primary-fixed/20 transition-colors"
                        >
                          <Box style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: "#E8F5EE",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#2E9E5B" }}>
                              {cat.icon}
                            </span>
                          </Box>
                          <Text size="sm" fw={500} c="var(--color-ink)">{cat.name}</Text>
                        </Group>
                      </Anchor>
                    ))}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            {/* Other nav links */}
            {navLinks.map((link) => (
              <Box key={link.label} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <Anchor
                  href={link.href}
                  underline="never"
                  onClick={() => setDrawerOpen(false)}
                  display="block"
                >
                  <Group justify="space-between" py="md">
                    <Text fw={600} size="sm" c="var(--color-ink)">{link.label}</Text>
                    <IconChevronRight size={16} color="var(--color-muted)" />
                  </Group>
                </Anchor>
              </Box>
            ))}

            {/* WhatsApp CTA */}
            <Button
              component="a"
              href="https://wa.me/2348001234567?text=Hi%20LagosApps%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              leftSection={<IconBrandWhatsapp size={18} />}
              fullWidth
              mt="lg"
              radius="xl"
              fw={700}
              style={{ background: "#25D366", color: "#fff" }}
            >
              Chat on WhatsApp
            </Button>

            {/* Account section */}
            <Box mt="md">
              {isAuthenticated && user ? (
                <Stack gap="xs">
                  <UnstyledButton
                    w="100%"
                    p="sm"
                    style={{
                      borderRadius: 14,
                      background: "var(--color-surface2)",
                      border: "1px solid var(--color-border)",
                    }}
                    component="a"
                    href="/dashboard"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Group>
                      <Avatar
                        src={user.avatar || undefined}
                        alt={userInitials}
                        size={40}
                        radius="xl"
                        color="green"
                      >
                        {userInitials}
                      </Avatar>
                      <Box flex={1} style={{ minWidth: 0 }}>
                        <Text fw={700} size="sm" c="var(--color-ink)" lineClamp={1}>
                          {user.firstName} {user.lastName}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>{user.email}</Text>
                      </Box>
                      <IconChevronRight size={16} color="var(--color-muted)" />
                    </Group>
                  </UnstyledButton>
                  <Button
                    variant="subtle"
                    color="red"
                    fullWidth
                    radius="xl"
                    leftSection={<IconLogout size={16} />}
                    onClick={() => { logout().catch(() => {}); setDrawerOpen(false) }}
                  >
                    Log out
                  </Button>
                </Stack>
              ) : (
                <Group grow gap="sm">
                  <Button
                    component="a"
                    href="/auth/login"
                    radius="xl"
                    fw={700}
                    variant="default"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Log in
                  </Button>
                  <Button
                    component="a"
                    href="/subscribe/plan"
                    radius="xl"
                    fw={700}
                    style={{ background: "linear-gradient(135deg, #2E9E5B, #1A6B3C)", color: "white" }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    Subscribe
                  </Button>
                </Group>
              )}
            </Box>

          </Stack>
        </ScrollArea>
      </Drawer>
    </>
  );
}
