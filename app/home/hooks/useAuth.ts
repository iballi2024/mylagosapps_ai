import { createContext, useContext } from "react";

export interface User {
  name: string;
  phone: string;
  email: string;
  addresses: string[];
  membershipTier: "none" | "bronze" | "silver" | "gold";
  walletBalance: number;
  referralCode: string;
  avatar: string | null;
}

export interface OrderStep {
  label: string;
  date: string;
  completed: boolean;
}

export interface Order {
  id: string;
  date: string;
  service: string;
  description: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  timeline: OrderStep[];
}

export interface Notification {
  id: string;
  type: "order" | "wallet" | "membership" | "system";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  runningBalance: number;
}

export interface Referral {
  id: string;
  name: string;
  date: string;
  service: string;
  commission: number;
  status: "pending" | "paid";
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  orders: Order[];
  walletTransactions: WalletTransaction[];
  referrals: Referral[];
  notifications: Notification[];
  unreadCount: number;
  login: (phone: string, password: string) => boolean;
  register: (name: string, phone: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateAvatar: (dataUrl: string) => void;
  addWalletFunds: (amount: number) => void;
  subscribeMembership: (tier: "bronze" | "silver" | "gold") => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  orders: [],
  walletTransactions: [],
  referrals: [],
  notifications: [],
  unreadCount: 0,
  login: () => false,
  register: () => {},
  logout: () => {},
  updateProfile: () => {},
  updateAvatar: () => {},
  addWalletFunds: () => {},
  subscribeMembership: () => {},
  markNotificationRead: () => {},
  markAllNotificationsRead: () => {},
  showAuth: false,
  setShowAuth: () => {},
  showDashboard: false,
  setShowDashboard: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// Demo data generators
export function generateDemoOrders(): Order[] {
  return [
    {
      id: "ORD-001", date: "2026-03-20", service: "Mainland Solar", description: "Solar Audit Booking — 3 Bedroom Flat", amount: 0, status: "completed",
      timeline: [
        { label: "Order Placed", date: "2026-03-20 09:15", completed: true },
        { label: "Audit Confirmed", date: "2026-03-20 11:30", completed: true },
        { label: "Engineer Assigned", date: "2026-03-21 08:00", completed: true },
        { label: "Audit Completed", date: "2026-03-22 14:00", completed: true },
        { label: "Report Delivered", date: "2026-03-22 17:30", completed: true },
      ],
    },
    {
      id: "ORD-002", date: "2026-03-18", service: "Van Lagos", description: "Van Rental — Lekki to Ikeja", amount: 35000, status: "completed",
      timeline: [
        { label: "Booking Placed", date: "2026-03-18 07:00", completed: true },
        { label: "Driver Assigned", date: "2026-03-18 07:15", completed: true },
        { label: "Pickup Confirmed", date: "2026-03-18 09:00", completed: true },
        { label: "In Transit", date: "2026-03-18 09:30", completed: true },
        { label: "Delivered", date: "2026-03-18 11:45", completed: true },
      ],
    },
    {
      id: "ORD-003", date: "2026-03-15", service: "LagosCart", description: "Weekly Groceries Delivery", amount: 28500, status: "completed",
      timeline: [
        { label: "Order Placed", date: "2026-03-15 10:00", completed: true },
        { label: "Items Picked", date: "2026-03-15 11:30", completed: true },
        { label: "Out for Delivery", date: "2026-03-15 13:00", completed: true },
        { label: "Delivered", date: "2026-03-15 14:20", completed: true },
      ],
    },
    {
      id: "ORD-004", date: "2026-03-22", service: "Mainland Clinics", description: "Teleconsultation — Dr. Adeyemi", amount: 15000, status: "pending",
      timeline: [
        { label: "Appointment Booked", date: "2026-03-22 08:00", completed: true },
        { label: "Payment Confirmed", date: "2026-03-22 08:01", completed: true },
        { label: "Doctor Assigned", date: "2026-03-22 09:00", completed: true },
        { label: "Consultation", date: "2026-03-24 15:00", completed: false },
        { label: "Report Sent", date: "", completed: false },
      ],
    },
    {
      id: "ORD-005", date: "2026-03-10", service: "Mainland Events", description: "Conference Room — 4 hours", amount: 60000, status: "completed",
      timeline: [
        { label: "Booking Placed", date: "2026-03-08 14:00", completed: true },
        { label: "Deposit Paid (40%)", date: "2026-03-08 14:05", completed: true },
        { label: "Booking Confirmed", date: "2026-03-08 16:00", completed: true },
        { label: "Event Day", date: "2026-03-10 09:00", completed: true },
        { label: "Balance Paid", date: "2026-03-10 13:00", completed: true },
      ],
    },
  ];
}

export function generateDemoNotifications(): Notification[] {
  return [
    { id: "NTF-001", type: "order", title: "Teleconsultation Reminder", message: "Your appointment with Dr. Adeyemi is tomorrow at 3:00 PM.", date: "2026-03-23 10:00", read: false },
    { id: "NTF-002", type: "wallet", title: "Wallet Top-up Successful", message: "₦100,000 has been added to your wallet. New balance: ₦187,500.", date: "2026-03-22 12:00", read: false },
    { id: "NTF-003", type: "membership", title: "Silver Benefits Refreshed", message: "Your free monthly grocery delivery is now available. Order before March 31.", date: "2026-03-21 09:00", read: false },
    { id: "NTF-004", type: "order", title: "Solar Audit Report Ready", message: "Your Mainland Solar audit report for ORD-001 is ready to download.", date: "2026-03-22 17:30", read: true },
    { id: "NTF-005", type: "system", title: "Referral Commission Earned", message: "₦25,000 commission credited to your wallet for referring Chidi O.", date: "2026-03-10 15:00", read: true },
    { id: "NTF-006", type: "order", title: "Groceries Delivered", message: "Your LagosCart order ORD-003 has been delivered.", date: "2026-03-15 14:20", read: true },
  ];
}

export function generateDemoWallet(): WalletTransaction[] {
  return [
    { id: "TXN-001", date: "2026-03-22", description: "Wallet Top-up", amount: 100000, type: "credit", runningBalance: 187500 },
    { id: "TXN-002", date: "2026-03-20", description: "Van Lagos — Van Rental", amount: 35000, type: "debit", runningBalance: 87500 },
    { id: "TXN-003", date: "2026-03-18", description: "LagosCart — Groceries", amount: 28500, type: "debit", runningBalance: 122500 },
    { id: "TXN-004", date: "2026-03-15", description: "Wallet Top-up", amount: 50000, type: "credit", runningBalance: 151000 },
    { id: "TXN-005", date: "2026-03-12", description: "Mainland Clinics — Teleconsult", amount: 15000, type: "debit", runningBalance: 101000 },
    { id: "TXN-006", date: "2026-03-10", description: "Referral Commission — Solar", amount: 25000, type: "credit", runningBalance: 116000 },
  ];
}

export function generateDemoReferrals(): Referral[] {
  return [
    { id: "REF-001", name: "Chidi O.", date: "2026-03-10", service: "Mainland Solar — 5KW Install", commission: 25000, status: "paid" },
    { id: "REF-002", name: "Amara T.", date: "2026-03-18", service: "Mainland Solar — 8KW Install", commission: 25000, status: "pending" },
    { id: "REF-003", name: "Kunle A.", date: "2026-02-28", service: "Mainland Solar — 10KW Install", commission: 25000, status: "paid" },
  ];
}
