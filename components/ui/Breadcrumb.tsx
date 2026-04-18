import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium mb-6 flex-wrap">
      <Link href="/dashboard" className="text-muted hover:text-primary transition-colors flex items-center gap-1">
        <Home size={12} />
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-muted-light" />
          {crumb.href && i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="text-muted hover:text-primary transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-primary font-semibold">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
