import type { ReactElement } from "react";
import { getPageRoot } from "../vendor/framer/script_main.CmnDAcsZ.mjs";
interface PageRequest {
  routeId: string;
  localeId: "default";
  pathVariables?: Record<string, string>;
}
/** Preserve the original router, transitions, CMS links, lightboxes and section effects.
 * This boundary deliberately keeps generated dependencies out of authored components.
 */
export async function createPortfolioPage(
  pathname: string,
): Promise<ReactElement> {
  const path = decodeURIComponent(pathname).replace(/\/$/, "") || "/";
  const routes: Record<string, string> = {
    "/": "augiA20Il",
    "/contact": "r8y6W4ZiG",
    "/about": "snNluSBUy",
    "/works": "aELI0FMfH",
    "/blog": "Axh78v3qf",
  };
  const request: PageRequest = {
    routeId: routes[path] ?? "tzT2aobSM",
    localeId: "default",
  };
  if (path.startsWith("/works/")) {
    request.routeId = "LsjGxoB0t";
    request.pathVariables = { OKTJIdQkY: path.slice(7) };
  }
  if (path.startsWith("/blog/")) {
    request.routeId = "u5gnDfAFE";
    request.pathVariables = { ZryGgMypY: path.slice(6) };
  }
  return (await getPageRoot({
    ...request,
    pathVariables: request.pathVariables,
    collectionItemId: undefined,
  })) as ReactElement;
}
