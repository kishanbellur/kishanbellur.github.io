import { createRemoteJWKSet, jwtVerify } from "jose";

const FIREBASE_JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

let jwks = null;
function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
  }
  return jwks;
}

export async function verifyAdminToken(request, env) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { ok: false, status: 401, message: "Not signed in." };
  }

  let payload;
  try {
    const result = await jwtVerify(match[1], getJwks(), {
      issuer: `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`,
      audience: env.FIREBASE_PROJECT_ID,
    });
    payload = result.payload;
  } catch (error) {
    return { ok: false, status: 401, message: "Invalid or expired sign-in. Please sign in again." };
  }

  if (!payload.email_verified || payload.email !== env.ADMIN_EMAIL) {
    return { ok: false, status: 403, message: "This account is not authorized to add content." };
  }

  return { ok: true, email: payload.email };
}

export function verifyClassCode(providedCode, env) {
  return typeof providedCode === "string" && providedCode.length > 0 && providedCode === env.CLASS_ACCESS_CODE;
}
