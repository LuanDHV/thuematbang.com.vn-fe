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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.34fr)] lg:items-start">
      <div className="min-w-0">{main}</div>
      <div className="min-w-0">{aside}</div>
    </div>
  );
}
