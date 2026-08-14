export function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function withCors(response, env) {
  const headers = new Headers(response.headers);
  const cors = corsHeaders(env);
  for (const key in cors) {
    headers.set(key, cors[key]);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function preflightResponse(env) {
  return new Response(null, { status: 204, headers: corsHeaders(env) });
}
