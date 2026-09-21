import * as React from "react";
import { cn } from "./lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-card)] border border-slate-wire bg-dusk-ledger px-3 py-2 text-sm text-paper-fog placeholder:text-paper-fog/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lamp-amber disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
