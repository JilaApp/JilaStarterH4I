import { memo } from "react";
import NextLink from "next/link";
import clsx from "clsx";
import { isValidURL } from "@/lib/validators";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const Link = memo(function Link({
  href,
  children,
  className = "",
  external = false,
  onClick,
}: LinkProps) {
  const linkClasses = clsx(
    "link-text text-jila-400 hover:underline",
    className,
  );

  if (external) {
    if (!isValidURL(href)) {
      return <span className="text-gray-300">{children}</span>;
    }

    return (
      <a
        href={href}
        className={linkClasses}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={linkClasses} onClick={onClick}>
      {children}
    </NextLink>
  );
});

export default Link;
