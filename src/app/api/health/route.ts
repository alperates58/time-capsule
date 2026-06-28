import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Global instance to prevent multiple connections in dev,
// but for healthcheck we can just use a fresh one and disconnect to be completely isolated.
// However, reusing the existing connection is a better "real world" ping.
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Do not cache this endpoint

export async function GET() {
  try {
    // Attempt a trivial DB query (just "SELECT 1" essentially).
    // If DB is unreachable, this will throw.
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 503 } // 503 Service Unavailable
    );
  }
}
