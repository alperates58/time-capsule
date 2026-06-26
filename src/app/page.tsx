import { Metadata } from "next";
import Link from "next/link";
import { TimelinePreview } from "@/components/shared/timeline-preview";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { YearSelector } from "@/components/navigation/year-selector";

export const metadata: Metadata = {
  title: "TimeCapsule | The Digital Memory of the World",
  description: "Explore any year in history. Relive every moment. TimeCapsule is an open knowledge graph of human culture, technology, and events.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 animate-fade-in bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-2 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Phase 8: Navigation & Discovery Active
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl drop-shadow-sm text-balance">
            The Digital Memory of the World.
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground font-light max-w-2xl mx-auto text-balance">
            Explore Any Year. Relive Every Moment.
          </p>

          <div className="pt-8 w-full max-w-md mx-auto">
            <YearSelector />
          </div>
        </div>
      </section>

      {/* Featured Golden Sample */}
      <section id="explore" className="py-24 px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">Golden Sample Year</h2>
              <p className="text-lg text-muted-foreground">
                We are meticulously curating the timeline. Experience our first fully connected knowledge graph dataset focusing on 1998 — the dawn of the modern internet.
              </p>
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/1998">
                  Explore 1998 <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              <CardContent className="p-8 sm:p-12 relative z-10 flex flex-col justify-center min-h-[300px]">
                <h3 className="text-6xl sm:text-8xl font-black text-primary/80 tracking-tighter mb-4">1998</h3>
                <p className="text-xl font-medium text-foreground/90">The Dawn of the Modern Internet Age</p>
                <p className="text-sm text-muted-foreground mt-4">Featuring: Google, Half-Life, Windows 98, and Titanic.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Preview Component */}
      <section id="years" className="w-full py-24 bg-muted/30 border-y border-border/50 overflow-hidden scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">The Interactive Timeline</h2>
          <p className="text-muted-foreground text-lg">A visual journey through time.</p>
        </div>
        <TimelinePreview />
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 scroll-mt-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-6">What is TimeCapsule?</h2>
        <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground">
          <p>
            TimeCapsule is not just a history blog. It is an interconnected knowledge graph designed to preserve human culture, technology, media, and world events.
          </p>
          <p>
            By modeling everything as an entity, we can trace the exact cultural impact of a movie, a video game, or a scientific discovery and visually link it to the year it defined.
          </p>
        </div>
      </section>

    </div>
  );
}
