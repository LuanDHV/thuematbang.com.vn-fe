export function isProductionAppEnv() {
  return process.env.NODE_ENV === "production";
}
