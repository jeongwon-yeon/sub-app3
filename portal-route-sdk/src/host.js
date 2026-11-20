import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createMessage, getChildPath, isMessage, normalizePath, routeToString } from "./protocol.js";

export function PortalHostSync({ iframeRef, serviceOrigin, basePath }) {
  const navigate = useNavigate();
  const fullPath = routeToString(useLocation());
  const router = useRef(null);
  const child = useRef(null);
  router.current = { navigate, fullPath };

  useLayoutEffect(() => {
    const onMessage = (event) => {
      // A sibling iframe's ref may attach after this layout effect runs.
      const frame = iframeRef.current?.contentWindow;
      if (!frame || event.origin !== serviceOrigin || event.source !== frame) return;

      if (child.current?.frame !== frame) child.current = null;
      const ready = isMessage(event.data, "CHILD_READY");
      if (!ready && !isMessage(event.data, "CHILD_ROUTE_CHANGED")) return;
      const { documentId } = event.data;
      const path = normalizePath(event.data.path);
      const hostPath = getChildPath(router.current.fullPath, basePath);
      if (path === null || hostPath === null || (!ready && child.current?.documentId !== documentId)) return;

      if (ready) {
        // The first document restores the portal URL. Later documents report their own URL.
        const target = child.current ? path : hostPath;
        child.current = { frame, documentId, path: target };
        frame.postMessage(createMessage("HOST_NAVIGATE", documentId, target), serviceOrigin);
        if (target !== path) return;
      } else {
        child.current.path = path;
      }

      if (path === hostPath) return;
      const suffix = path === "/" || path.startsWith("/?") || path.startsWith("/#") ? path.slice(1) : path;
      router.current.navigate(basePath + suffix, { replace: true });
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      child.current = null;
    };
  }, [iframeRef, serviceOrigin, basePath]);

  useEffect(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame || child.current?.frame !== frame) return;
    const path = getChildPath(fullPath, basePath);
    if (path === null || path === child.current.path) return;

    child.current.path = path;
    frame.postMessage(
      createMessage("HOST_NAVIGATE", child.current.documentId, path),
      serviceOrigin,
    );
  }, [fullPath, iframeRef, serviceOrigin, basePath]);

  return null;
}
