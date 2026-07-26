import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <div className="mt-6 text-center text-sm text-text-secondary">
      {text}{" "}
      <Link href={href} className="text-primary hover:underline font-medium transition-colors">
        {linkText}
      </Link>
    </div>
  );
}
