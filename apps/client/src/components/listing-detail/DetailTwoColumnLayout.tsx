import { ReactNode } from "react";

type DetailTwoColumnLayoutProps = {
  main: ReactNode;
  aside: ReactNode;
};

export default function DetailTwoColumnLayout({
  main,
  aside,
}: DetailTwoColumnLayoutProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
      <div className="min-w-0 h-full lg:col-span-2">{main}</div>
      <div className="min-w-0 h-full lg:col-span-1">{aside}</div>
    </div>
  );
}
