import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

async function forward(request: NextRequest) {
  const incomingPath = request.nextUrl.pathname.replace(/^\/api\/backend/, "");
  const targetUrl = `${BACKEND_URL}${incomingPath}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const backendRes = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
    redirect: "manual",
  });

  const responseHeaders = new Headers(backendRes.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) {
  return forward(request);
}

export async function POST(request: NextRequest) {
  return forward(request);
}

export async function PATCH(request: NextRequest) {
  return forward(request);
}

export async function PUT(request: NextRequest) {
  return forward(request);
}

export async function DELETE(request: NextRequest) {
  return forward(request);
}
