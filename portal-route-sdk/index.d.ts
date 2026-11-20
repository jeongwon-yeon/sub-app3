import type { RefObject } from "react";

/** Install within the child service's React Router. */
export declare function PortalRouteSync(props: { parentOrigin: string }): null;

/** Install within the host's React Router alongside its iframe. */
export declare function PortalHostSync(props: {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  serviceOrigin: string;
  /** Absolute portal prefix, e.g. '/service-a', without a trailing slash. */
  basePath: string;
}): null;
