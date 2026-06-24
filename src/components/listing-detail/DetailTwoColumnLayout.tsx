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
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.32fr)] lg:items-stretch">
      <div className="min-w-0 h-full">{main}</div>
      <div className="min-w-0 h-full">{aside}</div>
    </div>
  );
}
