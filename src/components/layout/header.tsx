import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block text-xl tracking-tight">
              TimeCapsule
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/#explore" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Explore
            </Link>
            <Link href="/#years" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Years
            </Link>
            <Link href="/#about" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/1998" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
              1998 Demo
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
