import React from "react";
import LiquidChrome from "@/components/ui/liquid-chrome";

export type ChromeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
};

export function ChromeButton({
  children,
  className = "",
  baseColor = [0.0392156862745098, 0.0392156862745098, 0.0392156862745098],
  speed = 2,
  amplitude = 0.1,
  type = "button",
  ...props
}: ChromeButtonProps) {
  const defaultClasses = "relative py-4 px-6 rounded-full border-neutral-900 border-2 bg-neutral-950 overflow-hidden group text-white active:scale-95 transition-all duration-75 shadow-lg";

  return (
    <button
      type={type}
      className={className ? `relative overflow-hidden group ${className}` : defaultClasses}
      {...props}
    >
      <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none mix-blend-overlay">
        <LiquidChrome
          baseColor={baseColor}
          speed={speed}
          amplitude={amplitude}
          interactive={false}
        />
      </div>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}

export default ChromeButton;
