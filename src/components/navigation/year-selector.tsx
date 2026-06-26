"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function YearSelector() {
  const [year, setYear] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseInt(year, 10);
    if (!isNaN(y)) {
      router.push(`/${y}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mx-auto">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          type="number" 
          placeholder="Enter a year (e.g. 1998)" 
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="pl-9 h-12 text-lg"
          min={1}
          max={new Date().getFullYear()}
        />
      </div>
      <Button type="submit" size="lg" disabled={!year} className="h-12 px-8">
        Time Travel
      </Button>
    </form>
  );
}
