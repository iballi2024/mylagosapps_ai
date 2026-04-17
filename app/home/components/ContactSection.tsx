"use client";
import { useState, useCallback } from "react";
import Button from "./ui/Button";
import { useToast } from "../hooks/useToast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function validate(field: keyof FormData, value: string): string | undefined {
  switch (field) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return undefined;
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
      return undefined;
    case "phone":
      if (!value.trim()) return "Phone number is required";
      if (!/^\+?[0-9\s()-]{7,20}$/.test(value.trim())) return "Please enter a valid phone number";
      return undefined;
    case "message":
      if (!value.trim()) return "Message is required";
      if (value.trim().length < 10) return "Message must be at least 10 characters";
      return undefined;
    default:
      return undefined;
  }
}

export default function ContactSection() {
  const toast = useToast();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing again after touching
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
    }
  }, [touched]);

  const handleBlur = useCallback((field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, form[field]) }));
  }, [form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Honeypot check
      if (form.honeypot) {
        toast.success("Message sent successfully!");
        return;
      }

      // Validate all fields
      const fields = ["name", "email", "phone", "message"] as const;
      const newErrors: FormErrors = {};
      let firstInvalid: HTMLElement | null = null;

      for (const field of fields) {
        const error = validate(field, form[field]);
        if (error) {
          (newErrors as Record<string, string>)[field] = error;
          if (!firstInvalid) {
            firstInvalid = document.getElementById(`contact-${field}`);
          }
        }
      }

      setErrors(newErrors);
      setTouched({ name: true, email: true, phone: true, message: true });

      if (Object.keys(newErrors).length > 0) {
        toast.error("Please fix the errors in the form");
        firstInvalid?.focus();
        return;
      }

      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      })
        .then(async (res) => {
          const json = await res.json().catch(() => ({}));
          console.log({ json });
          if (!res.ok) {
            const msg =
              (typeof json?.message === "string" && json.message) ||
              (typeof json?.data === "string" && json.data) ||
              json?.error ||
              "Failed to send message. Please try again.";
            throw new Error(msg);
          }
          setSuccess(true);
          toast.success(json?.message ?? "Message sent! We'll get back to you shortly.");
          setForm({ name: "", email: "", phone: "", message: "", honeypot: "" });
          setTouched({});
          setErrors({});
          setTimeout(() => setSuccess(false), 1500);
        })
        .catch((err: unknown) => {
          toast.error(err instanceof Error ? err.message : "Failed to send message. Please try again.");
        })
        .finally(() => setLoading(false));
    },
    [form, toast]
  );

  const inputClass = (field: "name" | "email" | "phone" | "message") =>
    `w-full p-3 text-base text-on-background rounded-md transition-all duration-200 focus:outline-none ${
      errors[field] && touched[field]
        ? "bg-error-container/20 border-2 border-error"
        : "bg-surface-container-high border-2 border-transparent focus:border-primary"
    }`;

  return (
    <section id="contact" className="py-16 md:py-24 bg-primary text-on-primary">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 grid md:grid-cols-2 gap-12 md:gap-20">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
            Let&apos;s Talk.
          </h2>
          <p className="text-primary-fixed opacity-80 text-lg leading-relaxed max-w-md">
            Whether you need help choosing a solar package, booking a van, or
            finding the right membership tier — we&apos;re here. No bots, no runaround.
            Real people, real answers.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary-container flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-primary-fixed">mail</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-primary-fixed-dim">Email</p>
                <p className="text-lg font-semibold">hello@lagosapps.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary-container flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-primary-fixed">call</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-primary-fixed-dim">Phone</p>
                <p className="text-lg font-semibold">+234 (0) 800 LAGOS APPS</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary-container flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-primary-fixed">chat</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-primary-fixed-dim">WhatsApp</p>
                <a
                  href="https://wa.me/2348001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold hover:underline"
                >
                  Chat with us instantly
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeypot}
                onChange={(e) => handleChange("honeypot", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="text-xs font-bold text-primary uppercase">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  className={inputClass("name")}
                  placeholder="Your name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  aria-describedby={errors.name ? "error-name" : undefined}
                  aria-invalid={errors.name && touched.name ? "true" : undefined}
                />
                {errors.name && touched.name && (
                  <p id="error-name" className="flex items-center gap-1 text-xs text-error">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="text-xs font-bold text-primary uppercase">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  className={inputClass("email")}
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  aria-describedby={errors.email ? "error-email" : undefined}
                  aria-invalid={errors.email && touched.email ? "true" : undefined}
                />
                {errors.email && touched.email && (
                  <p id="error-email" className="flex items-center gap-1 text-xs text-error">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="text-xs font-bold text-primary uppercase">
                Phone Number
              </label>
              <input
                id="contact-phone"
                className={inputClass("phone")}
                placeholder="+234..."
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                aria-describedby={errors.phone ? "error-phone" : undefined}
                aria-invalid={errors.phone && touched.phone ? "true" : undefined}
              />
              {errors.phone && touched.phone && (
                <p id="error-phone" className="flex items-center gap-1 text-xs text-error">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="text-xs font-bold text-primary uppercase">
                How can we help?
              </label>
              <textarea
                id="contact-message"
                className={inputClass("message")}
                placeholder="Tell us what you need..."
                rows={4}
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onBlur={() => handleBlur("message")}
                aria-describedby={errors.message ? "error-message" : undefined}
                aria-invalid={errors.message && touched.message ? "true" : undefined}
              />
              {errors.message && touched.message && (
                <p id="error-message" className="flex items-center gap-1 text-xs text-error">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              success={success}
              className="w-full"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
