import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  // Retrieve the origin of the request, default to '*' if not present
  const origin = request.headers.get("origin") || "*";

  // Handle preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, api-key",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  // Handle standard requests
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, api-key");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

// Only run this middleware on API routes
export const config = {
  matcher: "/api/:path*",
};
