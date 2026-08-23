"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const button = cva(
  "inline-flex items-center justify-center rounded-sm border px-[18px] py-[11px] font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "border-rule bg-panel text-ink hover:border-brass",
        primary: "border-brass bg-brass/10 text-brass-hi hover:bg-brass/20",
        danger: "border-madder/45 bg-transparent text-madder hover:bg-madder/10",
        ghost: "border-transparent bg-transparent text-muted hover:text-ink",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, variant, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(button({ variant }), className)} {...props} />;
}
