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
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconBell,
  IconMenu2,
  IconX,
  IconBrandWhatsapp,
  IconUser,
} from "@tabler/icons-react";
// import Logo from "./Logo";
import { useAuth } from "../hooks/useAuth";
import Logo from "@/components/Logo";

const serviceCategories = [
  { name: "Solar, Renewables and More", icon: "solar_power", href: "#" },
  { name: "Cars, Vans and Rides", icon: "directions_car", href: "#" },
  { name: "Food, Groceries and Household", icon: "restaurant", href: "#" },
  { name: "Health and Wellness", icon: "health_and_safety", href: "#" },
  { name: "Events and Studios", icon: "celebration", href: "#" },
  { name: "A Better You", icon: "school", href: "#" },
];

const demoLinks = [
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, isAuthenticated, setShowAuth, setShowDashboard } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <>
      {/* ── Sticky header ── */}
      <Box
        component="header"
        className="glass-nav"
        pos="sticky"
        top={0}
        style={{
          zIndex: 50,
          height: 72,
          borderBottom: scrolled
            ? "1px solid var(--mantine-color-gray-2)"
            : "1px solid transparent",
          boxShadow: scrolled ? "var(--mantine-shadow-xs)" : "none",
          transition: "border-color 200ms, box-shadow 200ms",
        }}
        px={{ base: "md", md: "xl" }}
      >
        <Group
          h="100%"
          justify="space-between"
          maw={1280}
          mx="auto"
          pos="relative"
        >
          {/* Logo */}
          <Anchor href="/" underline="never">
            <Group gap="sm">
              <Logo />
              {/* <Text
                fw={800}
                size="xl"
                c="primary"
                style={{ letterSpacing: "-0.5px", fontFamily: "Syne, sans-serif" }}
              >
                LagosApps
              </Text> */}
            </Group>
          </Anchor>

          {/* Desktop centre nav */}
          <Group
            gap="xl"
            pos="absolute"
            style={{ left: "50%", transform: "translateX(-50%)" }}
            visibleFrom="md"
          >
            {/* Services dropdown */}
            <Menu shadow="md" radius="md" width={268} trigger="click">
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={4}>
                    <Text size="sm" fw={600}>
                      Services
                    </Text>
                    <IconChevronDown size={16} stroke={2} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {serviceCategories.map((cat) => (
                  <Menu.Item
                    key={cat.name}
                    component="a"
                    href={cat.href}
                    leftSection={
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 20,
                          color: "var(--mantine-color-primary-6)",
                        }}
                      >
                        {cat.icon}
                      </span>
                    }
                  >
                    <Text size="sm">{cat.name}</Text>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            {/* About / FAQ */}
            {demoLinks.map((link) => (
              <Anchor
                key={link.label}
                href={link.href}
                underline="never"
                c="inherit"
                fw={600}
                size="sm"
              >
                {link.label}
              </Anchor>
            ))}
          </Group>

          {/* Right actions */}
          <Group gap="sm">
            {/* Join CTA */}
            <Button
              component="a"
              href="#membership"
              className="bg-primary-gradient"
              fw={700}
              visibleFrom="md"
            >
              Join LagosApps
            </Button>
            {/* Authenticated: bell + avatar */}
            {isAuthenticated && user ? (
              <Group gap="sm" visibleFrom="md">
                <Indicator label="3" size={16} color="red" offset={4}>
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={() => setShowDashboard(true)}
                    aria-label="Notifications"
                  >
                    <IconBell size={22} />
                  </ActionIcon>
                </Indicator>

                <UnstyledButton
                  component="a"
                  href="/dashboard"
                  aria-label="Open dashboard"
                  title={user.name}
                >
                  <Avatar
                    src={user.avatar || undefined}
                    alt={user.name}
                    size={40}
                    radius="xl"
                    color="primary"
                  >
                    {userInitials}
                  </Avatar>
                </UnstyledButton>
              </Group>
            ) : (
              <Group gap="sm" visibleFrom="md">
                <Button component="a"
              display={'flex'}
              p={2}
              h={50}
              bg={'transparent'}
              bd={'none'}
              href="/auth/login">
                <ActionIcon
                  variant="default"
                  radius="xl"
                  size={40}
                  aria-label="Sign in"
                  visibleFrom="md"
                >
                  <IconUser size={20} />
                </ActionIcon>
              </Button>
                <Button
                  component="a"
                  href="/auth/login"
                  variant="subtle"
                  c="primary"
                  fw={600}
                >
                  Log In
                </Button>
                <Button
                  component="a"
                  href="/auth/signup"
                  className="bg-primary-gradient"
                  fw={700}
                >
                  Sign Up
                </Button>
                
              </Group>
            )}

            {/* Mobile hamburger */}
            <ActionIcon
              variant="subtle"
              size={44}
              hiddenFrom="md"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu2 size={28} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      {/* ── Mobile Drawer ── */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
        size="100%"
        padding={0}
        withCloseButton={false}
        zIndex={9999}
      >
        {/* Drawer top bar */}
        <Group
          justify="space-between"
          px="md"
          h={64}
          style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
        >
          <Anchor
            href="/"
            underline="never"
            onClick={() => setDrawerOpen(false)}
          >
            <Group gap="sm">
              <Logo />
              <Text
                fw={800}
                size="xl"
                c="primary"
                style={{ letterSpacing: "-0.5px", fontFamily: "Syne, sans-serif" }}
              >
                LagosApps
              </Text>
            </Group>
          </Anchor>
          <ActionIcon
            variant="subtle"
            size={44}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <IconX size={28} />
          </ActionIcon>
        </Group>

        {/* Drawer body */}
        <ScrollArea h="calc(100dvh - 64px)" px="md" py="md">
          <Stack gap={0}>
            {/* Services accordion */}
            <Accordion
              variant="default"
              chevron={<IconChevronDown size={18} />}
              styles={{
                control: { paddingLeft: 0, paddingRight: 0 },
                label: {
                  fontWeight: 700,
                  fontSize: "var(--mantine-font-size-lg)",
                  color: "var(--mantine-color-primary-6)",
                },
                item: {
                  borderBottom: "1px solid var(--mantine-color-gray-2)",
                },
                content: { paddingLeft: 0, paddingRight: 0 },
              }}
            >
              <Accordion.Item value="services">
                <Accordion.Control>Services</Accordion.Control>
                <Accordion.Panel>
                  <Stack gap={4} pb="sm">
                    {serviceCategories.map((cat) => (
                      <Anchor
                        key={cat.name}
                        href={cat.href}
                        underline="never"
                        c="inherit"
                        onClick={() => setDrawerOpen(false)}
                      >
                        <Group
                          gap="sm"
                          p="sm"
                          style={{ borderRadius: "var(--mantine-radius-md)" }}
                          className="hover:bg-primary-fixed/20 transition-colors"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: 20,
                              color: "var(--mantine-color-primary-6)",
                            }}
                          >
                            {cat.icon}
                          </span>
                          <Text size="md">{cat.name}</Text>
                        </Group>
                      </Anchor>
                    ))}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            {/* About / FAQ rows */}
            {demoLinks.map((link) => (
              <Box
                key={link.label}
                style={{
                  borderBottom: "1px solid var(--mantine-color-gray-2)",
                }}
              >
                <Anchor
                  href={link.href}
                  underline="never"
                  onClick={() => setDrawerOpen(false)}
                  display="block"
                >
                  <Group justify="space-between" py="md">
                    <Text fw={700} size="lg" c="primary">
                      {link.label}
                    </Text>
                    <IconChevronRight
                      size={20}
                      color="var(--mantine-color-gray-5)"
                    />
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
              leftSection={<IconBrandWhatsapp size={22} />}
              fullWidth
              mt="md"
              size="lg"
              fw={700}
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              Chat with us on WhatsApp
            </Button>

            {/* Account section */}
            <Box mt="md">
              {isAuthenticated && user ? (
                <UnstyledButton
                  w="100%"
                  p="sm"
                  style={{
                    borderRadius: "var(--mantine-radius-xl)",
                    background: "var(--mantine-color-gray-0)",
                  }}
                  component="a"
                  href="/dashboard"
                  onClick={() => setDrawerOpen(false)}
                >
                  <Group>
                    <Avatar
                      src={user.avatar || undefined}
                      alt={user.name}
                      size={40}
                      radius="xl"
                      color="primary"
                    >
                      {userInitials}
                    </Avatar>
                    <Box flex={1}>
                      <Text fw={700} size="sm" c="primary">
                        {user.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        View Dashboard
                      </Text>
                    </Box>
                    <IconChevronRight
                      size={20}
                      color="var(--mantine-color-gray-5)"
                    />
                  </Group>
                </UnstyledButton>
              ) : (
                <Group grow gap="sm">
                  <Button
                    component="a"
                    href="/auth/login"
                    size="lg"
                    fw={700}
                    variant="outline"
                    color="primary"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Log In
                  </Button>
                  <Button
                    component="a"
                    href="/auth/signup"
                    size="lg"
                    fw={700}
                    className="bg-primary-gradient"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Sign Up
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
