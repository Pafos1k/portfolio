import { Fragment, type ComponentType } from "react";
import { identity } from "../../content/portfolio";
type ExportedText = ComponentType<Record<string, unknown>>;
interface Props {
  Text: ExportedText;
  labelEffect: unknown;
  headingEffect: unknown;
}
/** Keep the original text-reveal component, styles, and two-line heading. */
export function HeroHeading({ Text, labelEffect, headingEffect }: Props) {
  const shared = {
    __fromCanvasComponent: true,
    fonts: ["Inter"],
    verticalAlignment: "top",
    withExternalLayout: true,
  };
  return (
    <div className="framer-4t8f21" data-framer-name="Title">
      <Text
        {...shared}
        className="framer-1tarxlf"
        data-framer-name={identity.greeting}
        effect={labelEffect}
      >
        <Fragment>
          <p
            className="framer-styles-preset-23zch4"
            data-styles-preset="HJX7DRoOT"
            dir="auto"
          >
            {identity.greeting}
          </p>
        </Fragment>
      </Text>
      <Text
        {...shared}
        className="framer-1352zrk"
        data-framer-name={identity.headline.join(" ")}
        effect={headingEffect}
      >
        <Fragment>
          {identity.headline.map((line) => (
            <h1
              key={line}
              className="framer-styles-preset-9jiir1"
              data-styles-preset="t73FnGceq"
              dir="auto"
            >
              {line}
            </h1>
          ))}
        </Fragment>
      </Text>
    </div>
  );
}
