import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  year: number;
}

export function Breadcrumb({ year }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 px-6 md:px-8 border-b border-border/40">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1.5" aria-label="Home">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        <li>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </li>
        <li>
          <Link href="/#years" className="hover:text-foreground transition-colors">
            Years
          </Link>
        </li>
        <li>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </li>
        <li>
          <span className="text-foreground font-medium" aria-current="page">
            {year}
          </span>
        </li>
      </ol>
    </nav>
  );
}
