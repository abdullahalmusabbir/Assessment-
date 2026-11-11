
import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    href?: string;
    variant?: "primary" | "outline";
    type?: "button" | "submit";
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export default function Button({
    children,
    href,
    variant = "primary",
    type = "button",
    onClick,
    disabled = false,
    className = "",
}: ButtonProps) {
    const style =
        variant === "primary"
            ? "primary-button"
            : "outline-button";

    const classes = `${style} ${className} ${disabled ? "cursor-not-allowed opacity-50" : ""
        }`;

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {children}
        </button>
    );
}
