export function isProductionAppEnv() {
  return process.env.NEXT_PUBLIC_APP_ENV === "production";
}
