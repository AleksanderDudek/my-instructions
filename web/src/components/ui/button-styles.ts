import { cva, type VariantProps } from "class-variance-authority";

/**
 * The glass button, as classes.
 *
 * Kept out of `button.tsx` because that module is a client component, and a
 * server component that imports a function from one receives a reference it
 * cannot call. Links that look like buttons — most of this app's calls to
 * action — take their classes from here instead of copying the string.
 *
 * Mono uppercase, cut square, at least 40px tall (44px on phones through
 * `tap`). `primary` is Uriel's mantle: a wine pane in a gold frame with a
 * lead line inside it. One per view.
 */
export const buttonClass = cva(
  "tap inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border px-[18px] py-[11px] font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "border-rule bg-panel-2 text-ink hover:border-brass",
        primary: "border-brass bg-wine text-on-wine shadow-[inset_0_0_0_1px_var(--color-lead)] hover:border-brass-hi",
        danger: "border-madder bg-transparent text-madder hover:bg-madder/10",
        ghost: "border-transparent bg-transparent text-muted hover:text-ink",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonClass>["variant"]>;
