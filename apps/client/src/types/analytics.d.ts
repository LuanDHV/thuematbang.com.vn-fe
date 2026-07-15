type DataLayerEvent = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export {};
