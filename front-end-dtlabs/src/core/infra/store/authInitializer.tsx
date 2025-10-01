import { useEffect } from "react";
import { useAuthStore } from "./authStore";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { loadUserFromToken } = useAuthStore();

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  return <>{children}</>;
}
