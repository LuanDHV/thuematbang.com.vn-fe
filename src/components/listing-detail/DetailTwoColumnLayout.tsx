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
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="w-full lg:w-3/4">{main}</div>
      <div className="w-full lg:w-1/4">{aside}</div>
    </div>
  );
}
