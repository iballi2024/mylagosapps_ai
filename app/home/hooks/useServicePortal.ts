import { createContext, useContext } from "react";

export type ServicePortalId =
  | "solar"
  | "transport"
  | "groceries"
  | "health"
  | "events"
  | "community"
  | null;

export interface ServicePortalContextValue {
  activePortal: ServicePortalId;
  openPortal: (id: ServicePortalId) => void;
  closePortal: () => void;
}

export const ServicePortalContext = createContext<ServicePortalContextValue>({
  activePortal: null,
  openPortal: () => {},
  closePortal: () => {},
});

export function useServicePortal() {
  return useContext(ServicePortalContext);
}
