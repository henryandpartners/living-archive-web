import { NextResponse } from 'next/server';

/**
 * Decap CMS OAuth proxy — redirects to the Decap-provided
 * GitHub OAuth service so users can authenticate without
 * setting up their own OAuth app.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  // Forward the request to Decap's OAuth proxy service
  const proxyUrl = `https://decap-cms-github-oauth-provider.vercel.app/api/auth?${params.toString()}`;
  const response = await fetch(proxyUrl);
  const data = await response.text();

  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);

  const proxyUrl = 'https://decap-cms-github-oauth-provider.vercel.app/api/auth';
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const data = await response.text();

  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
