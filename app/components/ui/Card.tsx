import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  rounded?: boolean;
  shadow?: boolean;
  color?: "white" | "mint" | "lavender";
}

export default function Card({
  children,
  rounded = true,
  shadow = true,
  color = "white",
  className = "",
  ...props
}: CardProps) {
  const colorMap = {
    white: "bg-white",
    mint: "bg-mint-100",
    lavender: "bg-lavender-100",
  };
  return (
    <div
      className={clsx(
        colorMap[color],
        rounded ? "rounded-3xl" : "rounded-lg",
        shadow ? "shadow-md" : "",
        "p-5 transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
