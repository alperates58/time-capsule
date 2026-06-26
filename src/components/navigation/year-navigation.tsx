import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPreviousYear, getNextYear } from "@/lib/routes";

interface YearNavigationProps {
  currentYear: number;
}

export function YearNavigation({ currentYear }: YearNavigationProps) {
  const prevYear = getPreviousYear(currentYear);
  const nextYear = getNextYear(currentYear);
  const currentActualYear = new Date().getFullYear();
  
  const canGoForward = nextYear <= currentActualYear + 10;

  return (
    <nav aria-label="Adjacent Years" className="flex items-center justify-between py-12 px-6 md:px-8 max-w-4xl mx-auto border-t border-border/50">
      <Link 
        href={`/${prevYear}`}
        className="group flex flex-col items-start gap-1 p-4 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1 group-hover:text-foreground transition-colors">
          <ChevronLeft className="w-3 h-3" /> Previous Year
        </span>
        <span className="text-2xl font-bold text-foreground/80 group-hover:text-foreground transition-colors">
          {prevYear}
        </span>
      </Link>
      
      {canGoForward ? (
        <Link 
          href={`/${nextYear}`}
          className="group flex flex-col items-end gap-1 p-4 rounded-lg hover:bg-muted/50 transition-colors text-right"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1 group-hover:text-foreground transition-colors">
            Next Year <ChevronRight className="w-3 h-3" />
          </span>
          <span className="text-2xl font-bold text-foreground/80 group-hover:text-foreground transition-colors">
            {nextYear}
          </span>
        </Link>
      ) : (
        <div className="w-[120px]" /> /* spacer */
      )}
    </nav>
  );
}
