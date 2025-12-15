'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg dark:shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/60",
        outline: "border border-border bg-transparent text-foreground hover:bg-muted hover:border-muted-foreground/30",
        ghost: "text-foreground hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
        accent: "bg-accent text-accent-foreground shadow-md hover:bg-accent/90 hover:shadow-lg dark:shadow-accent/20",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  // Always set suppressHydrationWarning to reduce client/server id mismatch
  const mergedProps = { ...props, suppressHydrationWarning: true };
  return (
    <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...mergedProps} />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
