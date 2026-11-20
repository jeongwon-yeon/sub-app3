export const MESSAGE_SOURCE = "portal-route-sdk-demo";
export const MESSAGE_VERSION = 2;

export function createMessage(type, documentId, path) {
  return { source: MESSAGE_SOURCE, version: MESSAGE_VERSION, type, documentId, path };
}

export function isMessage(data, type) {
  return Boolean(
    data && typeof data === "object" &&
    data.source === MESSAGE_SOURCE &&
    data.version === MESSAGE_VERSION &&
    data.type === type &&
    typeof data.documentId === "string" &&
    data.documentId.length > 0
  );
}

// Only accept an application-relative path, never a cross-origin URL.
export function normalizePath(input) {
  if (typeof input !== "string" || !input.startsWith("/") || input.startsWith("//") || /[\\\x00-\x1f\x7f]/.test(input)) {
    return null;
  }
  try {
    const url = new URL(input, "https://path-check.invalid");
    if (url.origin !== "https://path-check.invalid" || url.pathname.startsWith("//")) return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}

export function routeToString(location) {
  return location.pathname + location.search + location.hash;
}

export function getChildPath(fullPath, basePath) {
  if (fullPath === basePath) return "/";
  if (fullPath.startsWith(`${basePath}?`) || fullPath.startsWith(`${basePath}#`)) {
    return normalizePath(`/${fullPath.slice(basePath.length)}`);
  }
  if (!fullPath.startsWith(`${basePath}/`)) return null;
  return normalizePath(fullPath.slice(basePath.length));
}
