import React, { isValidElement } from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "secondary" | "success" | "danger" | "neutral" | "mint" | "lavender" | "indigo" | "gray";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

export default function Button({
  color = "primary",
  size = "md",
  rounded = true,
  asChild = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const colorMap = {
    primary: "bg-mint-500 text-white hover:bg-mint-400",
    secondary: "bg-lavender-400 text-white hover:bg-lavender-300",
    success: "bg-emerald-400 text-white hover:bg-emerald-300",
    danger: "bg-rose-400 text-white hover:bg-rose-300",
    neutral: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    mint: "bg-mint-400 text-white hover:bg-mint-300",
    lavender: "bg-lavender-400 text-white hover:bg-lavender-300",
    indigo: "bg-indigo-500 text-white hover:bg-indigo-400",
    gray: "bg-gray-300 text-gray-700 hover:bg-gray-400",
  };
  const sizeMap = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-7 py-3 text-lg",
  };
  if (asChild && isValidElement(children)) {
    // children을 제네릭 ReactElement로 타입 단언 (any 사용 금지)
    type ElementWithClass = React.ReactElement<{ className?: string }>;
    const child = children as ElementWithClass;
    return React.cloneElement(child, {
      ...props,
      className: clsx(
        child.props.className,
        "font-semibold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2",
        colorMap[color],
        sizeMap[size],
        rounded ? "rounded-full" : "rounded-lg",
        className
      ),
    });
  }
  return (
    <button
      className={clsx(
        "font-semibold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2",
        colorMap[color],
        sizeMap[size],
        rounded ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
