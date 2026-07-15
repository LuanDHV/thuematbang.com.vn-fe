declare module "@ant-design/charts" {
  import type { ComponentType } from "react";

  export const Line: ComponentType<Record<string, unknown>>;
  export const Pie: ComponentType<Record<string, unknown>>;
  export const Bar: ComponentType<Record<string, unknown>>;
  export const Column: ComponentType<Record<string, unknown>>;
}
