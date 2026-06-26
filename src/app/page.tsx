export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground transition-colors duration-300">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Placeholder Logo */}
        <div className="w-24 h-24 bg-primary rounded-xl flex items-center justify-center shadow-2xl mb-4">
          <span className="text-primary-foreground font-bold text-3xl tracking-tighter">TC</span>
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-4">
          TimeCapsule
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl">
          Explore Any Year. Relive Every Moment.
        </p>

        {/* Minimal Navigation Placeholder */}
        <nav className="mt-8 flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-primary transition-colors">About</a>
          <a href="#" className="hover:text-primary transition-colors">Explore</a>
        </nav>
      </div>
    </main>
  );
}
