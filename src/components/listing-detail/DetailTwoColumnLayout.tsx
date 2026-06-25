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
    <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
      <div className="min-w-0 h-full">{main}</div>
      <div className="min-w-0 h-full">{aside}</div>
    </div>
  );
}
