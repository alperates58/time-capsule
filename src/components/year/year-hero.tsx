import { getPrimaryThemeTokens } from "@/lib/timecapsule";
import { YearProfile } from "@prisma/client";

interface YearHeroProps {
  profile: YearProfile;
}

export function YearHero({ profile }: YearHeroProps) {
  const tokens = getPrimaryThemeTokens(profile);

  return (
    <section 
      className="relative overflow-hidden py-24 sm:py-32 flex flex-col items-center justify-center text-center px-6 transition-colors duration-1000"
    >
      {/* Dynamic Background Atmosphere */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${tokens.primaryColor} 0%, transparent 70%)`
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          TimeCapsule Entry
        </div>
        
        <h1 
          className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter"
          style={{ color: tokens.primaryColor }}
        >
          {profile.heroTitle}
        </h1>
        
        {profile.heroSubtitle && (
          <p className="text-2xl sm:text-3xl md:text-4xl text-foreground/80 font-light tracking-tight text-balance">
            {profile.heroSubtitle}
          </p>
        )}
        
        {profile.themeName && (
          <p className="text-lg text-muted-foreground mt-4 font-medium uppercase tracking-widest">
            {profile.themeName}
          </p>
        )}
      </div>
    </section>
  );
}
