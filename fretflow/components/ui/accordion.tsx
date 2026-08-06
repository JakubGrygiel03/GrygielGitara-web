"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      className={cn(
        "w-full divide-y divide-sky-100 overflow-hidden rounded-2xl border border-sky-100 bg-white",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "px-4 transition-colors data-[state=open]:bg-sky-50/60 sm:px-5",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex min-h-11 flex-1 items-start justify-between gap-3 py-4 text-left text-base font-semibold leading-snug text-slate-900 transition-colors hover:text-sky-700 sm:items-center sm:gap-4 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="size-5 shrink-0 text-sky-500 transition-transform duration-200"
          aria-hidden
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-sm data-[state=closed]:hidden"
      {...props}
    >
      <div className={cn("pb-4 text-base leading-[1.65] text-slate-700", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
