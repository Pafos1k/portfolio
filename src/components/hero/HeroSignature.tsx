import { identity } from "../../content/portfolio";
export function HeroSignature() {
  return (
    <img
      src={identity.signature}
      alt="Vladislav"
      style={{ height: "100%", width: "100%", objectFit: "contain" }}
    />
  );
}
