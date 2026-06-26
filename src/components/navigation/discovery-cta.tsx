import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export function DiscoveryCTA() {
  return (
    <section className="bg-primary/5 border-y border-primary/10 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Keep Exploring TimeCapsule</h2>
        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
          Every year holds incredible stories. Dive into our Golden Sample Year to see the full potential of our digital memory project.
        </p>
        <div className="pt-4">
          <Link 
            href="/1998" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2"
          >
            Experience 1998 <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
