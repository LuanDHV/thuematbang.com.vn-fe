import type { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async () => {
    return { can: true };
  },
  options: {
    buttons: { enableAccessControl: true, hideIfUnauthorized: false },
  },
};
