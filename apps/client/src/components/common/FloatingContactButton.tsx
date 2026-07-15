"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCirclePlus, MessageCircleX } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type FloatingContactAction = {
  label: string;
  href: string;
  iconSrc: string;
  external?: boolean;
  newTab?: boolean;
};

const HOTLINE_HREF = "tel:0968688081";
const ZALO_HREF = "https://zalo.me/0968688081";
const MESSENGER_HREF = "https://m.me/100706868087266";
const FACEBOOK_HREF = "https://www.facebook.com/thuematbangdv";

const FLOATING_CONTACT_ACTIONS: FloatingContactAction[] = [
  {
    label: "Zalo",
    href: ZALO_HREF,
    iconSrc:
      "https://img.icons8.com/?size=100&id=0m71tmRjlxEe&format=png&color=0068ff",
    external: true,
    newTab: true,
  },
  {
    label: "Messenger",
    href: MESSENGER_HREF,
    iconSrc:
      "https://img.icons8.com/?size=100&id=YFbzdUk7Q3F8&format=png&color=ffffff",
    external: true,
    newTab: true,
  },
  {
    label: "Facebook",
    href: FACEBOOK_HREF,
    iconSrc:
      "https://img.icons8.com/?size=100&id=118497&format=png&color=ffffff",
    external: true,
    newTab: true,
  },
  {
    label: "Hotline",
    href: HOTLINE_HREF,
    iconSrc:
      "https://img.icons8.com/?size=100&id=I24lanX6Nq71&format=png&color=ffffff",
    external: true,
  },
];

export default function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrollTopVisible(window.scrollY > 260);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <TooltipProvider delayDuration={140}>
      <div
        className={cn(
          "fixed right-4 z-70 flex flex-col items-center gap-3 transition-[bottom] duration-300 md:right-6",
          isScrollTopVisible
            ? "bottom-[calc(env(safe-area-inset-bottom)+5rem)] md:bottom-20"
            : "bottom-[calc(env(safe-area-inset-bottom)+1rem)] md:bottom-6",
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-5 opacity-0",
          )}
        >
          {FLOATING_CONTACT_ACTIONS.map((action, index) => {
            const buttonClassName = cn(
              "flex size-12 items-center justify-center rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            );

            return (
              <div
                key={action.label}
                className="flex justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    {action.external ? (
                      <a
                        href={action.href}
                        className={buttonClassName}
                        aria-label={action.label}
                        target={action.newTab ? "_blank" : undefined}
                        rel={action.newTab ? "noreferrer" : undefined}
                      >
                        <Image
                          src={action.iconSrc}
                          alt={action.label}
                          aria-hidden="true"
                          width={40}
                          height={40}
                        />
                      </a>
                    ) : (
                      <Link
                        href={action.href}
                        className={buttonClassName}
                        aria-label={action.label}
                      >
                        <Image
                          src={action.iconSrc}
                          alt={action.label}
                          aria-hidden="true"
                          width={40}
                          height={40}
                        />
                      </Link>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="left">{action.label}</TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setIsOpen((current) => !current);
          }}
          className={cn(
            "group border-primary bg-primary hover:bg-primary/90 focus-visible:ring-primary/20 relative flex size-12 cursor-pointer items-center justify-center rounded-full border text-white shadow-(--shadow-float) transition-[transform,box-shadow,background-color] duration-300 ease-out hover:scale-[1.03] hover:shadow-(--shadow-float) focus-visible:ring-2 focus-visible:outline-none",
          )}
          aria-label={isOpen ? "Đóng menu liên hệ" : "Mở menu liên hệ"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <MessageCircleX className="relative z-10 size-5 stroke-[2.2]" />
          ) : (
            <MessageCirclePlus className="relative z-10 size-5 stroke-[2.2]" />
          )}
        </button>
      </div>
    </TooltipProvider>
  );
}
