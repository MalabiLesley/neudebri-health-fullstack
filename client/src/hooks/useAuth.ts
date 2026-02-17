import { useMemo } from "react";

export function useAuth() {
  // lightweight stub for dev; replace with real auth later
  const user = useMemo(
    () => ({
      id: "dev-user",
      firstName: "Dev",
      lastName: "User",
      role: "clinician",
    }),
    []
  );

  return { user };
}
