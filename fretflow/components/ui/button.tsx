import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-center transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-11 px-5 whitespace-normal sm:whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-sky-500 text-white hover:bg-sky-600 hover:shadow-md hover:shadow-sky-500/25",
        secondary:
          "bg-sky-50 text-slate-900 border border-sky-100 hover:bg-sky-100 hover:border-sky-200",
        outline:
          "border border-slate-200 bg-white/70 text-slate-900 hover:bg-white hover:border-slate-300",
        ghost: "hover:bg-sky-50 text-slate-900",
        link: "text-sky-600 underline-offset-4 hover:underline min-h-0 px-0 active:scale-100",
      },
      size: {
        default: "min-h-11 px-5 py-2.5",
        sm: "min-h-10 rounded-lg px-3.5 text-sm",
        lg: "min-h-12 rounded-xl px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
