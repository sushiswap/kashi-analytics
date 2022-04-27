import classNames from "classnames";
import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";

const classBySize = {
  xs: "text-xs px-2 py-1",
  sm: "text-sm px-3 py-1",
  md: "text-md px-6 py-2",
  lg: "text-lg px-8 py-3",
  xl: "text-xl px-10 py-4",
};

const classByColor = {
  emerald: {
    outlined:
      "border border-emerald-500 bg-transparent text-emerald-500 hover:bg-emerald-500 hover:text-white",
    solid: "text-white bg-emerald-600 hover:bg-emerald-700",
  },
};

const classByRounded = {
  none: "",
  sm: "rounded rounded-sm",
  md: "rounded rounded-md",
  lg: "rounded rounded-lg",
  xl: "rounded rounded-xl",
  full: "rounded rounded-full",
};

const Button = ({
  onClick,
  color = "emerald",
  children,
  outlined = true,
  rounded = "none",
  size = "md",
  href = "",
  ...rest
}: {
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  className?: string;
  color?: "emerald";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  outlined?: boolean;
}) => {
  const bySize = classBySize[size];
  const byColor = classByColor[color];
  const byRounded = classByRounded[rounded];
  const className = classNames({
    "transition-colors": true,
    [bySize]: true,
    [byColor[outlined ? "outlined" : "solid"]]: true,
    [byRounded]: true,
  });
  return href ? (
    <Link href={href}>
      <a {...rest} className={className}>
        {children}
      </a>
    </Link>
  ) : (
    <button {...rest} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
