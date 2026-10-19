/** Content contracts for future features. No playback or new project links are enabled. */
export interface PortraitAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}
export interface VideoIntroDefinition {
  src: string;
  poster: string;
  durationSeconds: number;
}
export interface ProjectDefinition {
  id: string;
  title: string;
  image: string;
  href?: string;
}
export interface FutureFeatures {
  videoIntro: VideoIntroDefinition | null;
  clickableProjects: readonly ProjectDefinition[];
}
