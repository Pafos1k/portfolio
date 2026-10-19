import type { ComponentType } from "react";
interface Props {
  Navigation: ComponentType<Record<string, unknown>>;
  [key: string]: unknown;
}
/** Original responsive navigation, hover transitions, menu state and routing.
 * Keep its variant/layout props intact: no extra DOM wrapper is introduced.
 */
export function SiteNavigation({ Navigation, ...props }: Props) {
  return <Navigation {...props} />;
}
