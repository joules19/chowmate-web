import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd"; // Import Ant Design's Button

type ButtonMode = "black" | "solid" | "outline" | "outline-neutral" | "google";

interface ButtonProps extends AntButtonProps {
  buttonText: string;
  mode: ButtonMode;
  loading?: boolean;
  disabled?: boolean;
  defaultColor?: string;
  hoverColor?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      buttonText,
      disabled,
      loading,
      mode,
      defaultColor = "",
      hoverColor = "",
      ...props
    },
    ref
  ) => {
    // Define mode-specific styles
    const baseButtonStyles = clsx(
      "flex items-center justify-center gap-2 rounded-[5px] transition-all duration-300 ease-in-out transform active:scale-95 cursor-pointer"
    );

    const buttonStyles = {
      black: clsx(
        baseButtonStyles,
        "bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed" // Use bg-black
      ),
      solid: clsx(
        baseButtonStyles,
        `bg-${defaultColor} text-white hover:bg-${hoverColor} disabled:cursor-not-allowed`
      ),
      outline: clsx(
        baseButtonStyles,
        "border-2 bg-transparent",
        `border-primary-1 text-${hoverColor} hover:bg-${hoverColor} hover:border-[0px] hover:text-white disabled:cursor-not-allowed`
      ),
      "outline-neutral": clsx(
        baseButtonStyles,
        "border bg-transparent",
        `border-dark-1 text-dark-1 hover:bg-${hoverColor} hover:text-dark-1 disabled:cursor-not-allowed`
      ),
      google: clsx(
        baseButtonStyles,
        "border bg-transparent",
        `border-dark-3 text-dark-1 hover:bg-${hoverColor} hover:text-dark-1 disabled:cursor-not-allowed`
      ),
    };

    return (
      <AntButton
        ref={ref}
        className={clsx(buttonStyles[mode], className)}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? "Loading..." : buttonText}
      </AntButton>
    );
  }
);

Button.displayName = "Button"; // Optional but recommended for debugging

export { Button };
