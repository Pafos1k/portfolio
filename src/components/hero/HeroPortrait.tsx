import type { ComponentType } from "react";
import { portrait } from "../../content/portfolio";
interface Props {
  Frame: ComponentType<Record<string, unknown>>;
  background?: Record<string, unknown>;
  [key: string]: unknown;
}
/** The Framer frame owns the original motion and responsive dimensions.
 * CSS supplies the existing silhouette mask, proportions, and 20px offset.
 * A future intro can be added here without changing the surrounding layout.
 */
export function HeroPortrait({ Frame, background, ...frameProps }: Props) {
  return (
    <Frame
      {...frameProps}
      background={{
        ...background,
        src: portrait.src,
        srcSet: `${portrait.src} ${portrait.width}w`,
        alt: portrait.alt,
      }}
    />
  );
}
