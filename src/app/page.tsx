import { TimelinePreview } from "@/components/shared/timeline-preview";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-4rem)] p-6 sm:p-24 animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-12 max-w-5xl mx-auto w-full">
        
        {/* Hero Section */}
        <section className="space-y-6 animate-fade-in-up">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl drop-shadow-sm">
            TimeCapsule
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground font-light max-w-2xl mx-auto text-balance">
            Explore Any Year. Relive Every Moment.
          </p>
        </section>

        {/* Timeline Preview Component */}
        <section className="w-full animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <TimelinePreview />
        </section>

        {/* Coming Soon Message */}
        <section className="w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl dark:shadow-glow">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Foundation Mode</h2>
              <p className="text-sm text-muted-foreground text-balance">
                We are currently building the digital memory of the world. Phase 2 layout foundation is active.
              </p>
              <div className="pt-4 flex justify-center">
                <Button disabled className="w-full font-medium">Portal Closed</Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
      </div>
    </div>
  );
}
