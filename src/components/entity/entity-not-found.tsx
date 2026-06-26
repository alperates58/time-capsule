import { SearchX } from "lucide-react";
import { DiscoveryCTA } from "@/components/navigation/discovery-cta";

interface EntityNotFoundProps {
  slug: string;
}

export function EntityNotFound({ slug }: EntityNotFoundProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 animate-fade-in-up">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <SearchX className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Entity Not Found
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-2">
          We could not find any records for <span className="font-semibold text-foreground">&quot;{slug}&quot;</span>.
        </p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          It may not have been ingested into the TimeCapsule yet, or the URL might be incorrect.
        </p>
      </div>
      <DiscoveryCTA />
    </div>
  );
}
