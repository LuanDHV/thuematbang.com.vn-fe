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
    <div className="mb-4">
      <JsonLd
        data={buildBreadcrumbListSchema(
          breadcrumbItemsFromAppBreadcrumb(items),
          canonicalUrl,
        )}
      />
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      asChild
                      className="text-primary hover:text-primary/80 font-semibold"
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
    </div>
  );
}
