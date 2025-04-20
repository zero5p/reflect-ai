"use client";
import React from "react";
import { Plus } from "lucide-react";
import clsx from "clsx";

interface FloatingActionButtonProps {
  onClick?: () => void;
  label?: string;
  href?: string;
  className?: string;
}

export default function FloatingActionButton({
  onClick,
  label = "추가",
  href,
  className = "",
}: FloatingActionButtonProps) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "fixed bottom-24 right-6 md:bottom-10 md:right-10 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-mint-500 hover:bg-mint-400 text-white shadow-xl transition-all border-4 border-white focus:outline-none focus:ring-4 focus:ring-mint-200",
        className
      )}
      aria-label={label}
    >
      <Plus className="w-8 h-8" />
    </button>
  );
  if (href) {
    return (
      <a href={href} className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-50">
        {button}
      </a>
    );
  }
  return button;
}
