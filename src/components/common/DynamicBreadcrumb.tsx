import Link from "next/link";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import JsonLd from "@/components/common/JsonLd";
import type { BreadcrumbItem as Item } from "@/lib/listing/flat-url";
import {
  breadcrumbItemsFromAppBreadcrumb,
  buildBreadcrumbListSchema,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

type Props = {
  items: Item[];
  className?: string;
  canonicalUrl?: string;
};

export default function DynamicBreadcrumb({
  items,
  className,
  canonicalUrl,
}: Props) {
  if (!items.length) return null;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbListSchema(
          breadcrumbItemsFromAppBreadcrumb(items),
          canonicalUrl,
        )}
      />
      <Breadcrumb className={cn("inline-flex w-full items-center", className)}>
        <BreadcrumbList className="text-body text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="text-heading font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      asChild
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast ? <BreadcrumbSeparator /> : null}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
