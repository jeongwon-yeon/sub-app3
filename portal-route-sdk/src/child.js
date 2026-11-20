import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createMessage, isMessage, normalizePath, routeToString } from "./protocol.js";

export function PortalRouteSync({ parentOrigin }) {
  const navigate = useNavigate();
  const path = routeToString(useLocation());
  const router = useRef(null);
  const documentId = useRef(null);
  const reportedPath = useRef(null);
  const announcedOrigin = useRef(null);
  router.current = { navigate, path };

  useEffect(() => {
    if (window.parent === window) return;
    documentId.current ??= window.crypto.randomUUID();

    const onMessage = (event) => {
      if (event.source !== window.parent || event.origin !== parentOrigin) return;
      if (!isMessage(event.data, "HOST_NAVIGATE") || event.data.documentId !== documentId.current) return;
      const next = normalizePath(event.data.path);
      if (next === null) return;

      reportedPath.current = next;
      if (router.current.path !== next) router.current.navigate(next, { replace: true });
    };

    const announce = () => {
      reportedPath.current = null;
      window.parent.postMessage(createMessage("CHILD_READY", documentId.current, router.current.path), parentOrigin);
    };
    const onPageShow = (event) => {
      if (event.persisted) announce();
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("pageshow", onPageShow);
    // StrictMode runs setup again without starting a new document.
    if (announcedOrigin.current !== parentOrigin) {
      announcedOrigin.current = parentOrigin;
      announce();
    }

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [parentOrigin]);

  useEffect(() => {
    if (reportedPath.current === null || path === reportedPath.current) return;
    reportedPath.current = path;
    window.parent.postMessage(createMessage("CHILD_ROUTE_CHANGED", documentId.current, path), parentOrigin);
  }, [path, parentOrigin]);

  return null;
}
