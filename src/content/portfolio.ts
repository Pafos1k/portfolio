import type { FutureFeatures, PortraitAsset } from "../types/portfolio";
export const identity = {
  greeting: "HI, I'M VLAD",
  headline: ["Full Stack", "Developer"] as const,
  signature: "/assets/vladislav-signature.svg",
};
export const portrait: PortraitAsset = {
  src: "/assets/vlad-portrait.png",
  alt: "Vlad facing right",
  width: 1312,
  height: 1199,
};
// Reserved configuration only. Existing Framer project links are unaffected.
export const futureFeatures: FutureFeatures = {
  videoIntro: null,
  clickableProjects: [],
};
