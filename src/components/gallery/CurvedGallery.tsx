import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";

import { pt as useExportedReducedMotion } from "../../vendor/framer/framer.DwJ9gNTh.mjs";

interface GalleryImage {
  image?: { src?: string; alt?: string };
}
export interface CurvedGalleryProps {
  images?: readonly GalleryImage[];
  autoRotate?: boolean;
  rotationSpeed?: number;
  direction?: "left" | "right";
  perspective?: number;
  itemWidth?: number;
  itemHeight?: number;
  cameraZ?: number;
  gap?: number;
  borderRadius?: number;
  repetitionCount?: number;
  introAnimation?: boolean;
  introDelay?: number;
  introDuration?: number;
  introStartSpeed?: number;
  introEndSpeed?: number;
  introStartGap?: number;
  introEndGap?: number;
  style?: CSSProperties;
}
/** Exact geometry, easing, drag sensitivity and momentum from the exported carousel.
 * Cards intentionally remain non-clickable. Project destinations can be added later.
 */
export function CurvedGallery({
  images = [],
  autoRotate = true,
  rotationSpeed = 20,
  direction = "left",
  perspective = 500,
  itemWidth = 300,
  itemHeight = 200,
  cameraZ = 0,
  gap = 400,
  borderRadius = 12,
  repetitionCount = 24,
  introAnimation = false,
  introDelay = 0,
  introDuration = 2,
  introStartSpeed = 20,
  introEndSpeed = 20,
  introStartGap = 200,
  introEndGap = 600,
}: CurvedGalleryProps) {
  const reducedMotion = useExportedReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useMemo(() => {
    const available = images.filter((item) => item.image?.src);
    return available.length
      ? Array.from(
          { length: repetitionCount },
          (_, i) => available[i % available.length],
        )
      : [];
  }, [images, repetitionCount]);
  const angle = useRef(0),
    scale = useRef(1),
    currentGap = useRef(introAnimation ? introStartGap : gap);
  const visible = useRef(true),
    dragging = useRef(false),
    momentum = useRef<number | null>(null);
  const drag = useRef({
    startX: 0,
    startAngle: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const initialRadius = cards.length
    ? (itemWidth + (introAnimation ? introStartGap : gap)) /
      (2 * Math.sin(Math.PI / cards.length))
    : 0;
  function paint() {
    if (!ring.current) return;
    ring.current.style.transform = `translateZ(${cameraZ}px) rotateY(${angle.current}deg) scale(${scale.current})`;
    const radius = cards.length
      ? (itemWidth + currentGap.current) /
        (2 * Math.sin(Math.PI / cards.length))
      : 0;
    Array.from(ring.current.children).forEach((child, index) => {
      (child as HTMLElement).style.transform =
        `translate(-50%, -50%) rotateY(${(360 / cards.length) * index}deg) translateZ(${-radius}px)`;
    });
  }
  const paintRef = useRef(paint);
  paintRef.current = paint;
  useEffect(() => {
    const resize = () => {
      const el = container.current;
      if (!el) return;
      scale.current = Math.min(
        (el.clientHeight - 40) / itemHeight,
        (el.clientWidth - 40) / itemWidth,
        1,
      );
      paintRef.current();
    };
    resize();
    window.addEventListener("resize", resize);
    const observer = new IntersectionObserver(
      (entries) => {
        visible.current = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0 },
    );
    if (container.current) observer.observe(container.current);
    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [itemHeight, itemWidth]);
  useEffect(() => {
    if (!cards.length) return;
    currentGap.current = introAnimation ? introStartGap : gap;

    let frame = 0,
      last = 0,
      start: number | null = null;
    const tick = (time: number) => {
      if (reducedMotion) {
        angle.current = 0;
        paintRef.current();
        last = time;
        frame = requestAnimationFrame(tick);
        return;
      }
      last ||= time;
      if (!visible.current) {
        last = time;
        frame = requestAnimationFrame(tick);
        return;
      }
      const delta = time - last;
      last = time;
      let speed = rotationSpeed;
      if (introAnimation) {
        start ??= time;
        const elapsed = time - start - introDelay * 1000;
        const progress =
          elapsed < 0
            ? 0
            : 1 -
              Math.pow(1 - Math.min(elapsed / (introDuration * 1000), 1), 3);
        speed = introStartSpeed + (introEndSpeed - introStartSpeed) * progress;
        currentGap.current =
          introStartGap + (introEndGap - introStartGap) * progress;
      }
      if (autoRotate && !dragging.current)
        angle.current +=
          (speed * (direction === "left" ? 1 : -1) * delta) / 1000;
      paintRef.current();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (momentum.current !== null) cancelAnimationFrame(momentum.current);
    };
  }, [
    reducedMotion,
    cards.length,
    autoRotate,
    direction,
    rotationSpeed,
    gap,
    introAnimation,
    introDelay,
    introDuration,
    introStartSpeed,
    introEndSpeed,
    introStartGap,
    introEndGap,
  ]);
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!cards.length) return;
    dragging.current = true;
    setIsDragging(true);
    if (momentum.current !== null) cancelAnimationFrame(momentum.current);
    drag.current = {
      startX: event.clientX,
      startAngle: angle.current,
      lastX: event.clientX,
      lastTime: Date.now(),
      velocity: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const now = Date.now(),
      elapsed = now - drag.current.lastTime;
    if (elapsed > 0)
      drag.current.velocity = (event.clientX - drag.current.lastX) / elapsed;
    drag.current.lastX = event.clientX;
    drag.current.lastTime = now;
    angle.current =
      drag.current.startAngle - (event.clientX - drag.current.startX) * 0.35;
    paintRef.current();
  };
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    setIsDragging(false);
    let velocity = drag.current.velocity * 200;
    const decay = () => {
      if (Math.abs(velocity) > 0.1 && !dragging.current) {
        angle.current -= velocity * 0.016;
        velocity *= 0.95;
        paintRef.current();
        momentum.current = requestAnimationFrame(decay);
      } else momentum.current = null;
    };
    if (Math.abs(drag.current.velocity) > 0.01) {
      if (momentum.current !== null) cancelAnimationFrame(momentum.current);
      momentum.current = requestAnimationFrame(decay);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return (
    <div
      ref={container}
      data-portfolio-gallery
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: `${perspective}px`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={ring}
          style={{
            position: "relative",
            width: itemWidth,
            height: itemHeight,
            transformStyle: "preserve-3d",
            transform: `translateZ(${cameraZ}px)`,
            willChange: "transform",
          }}
        >
          {cards.map((item, index) => (
            <div
              key={`${item.image!.src}-${index}`}
              style={{
                position: "absolute",
                width: itemWidth,
                height: itemHeight,
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotateY(${(360 / cards.length) * index}deg) translateZ(${-initialRadius}px)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={item.image!.src}
                alt={item.image!.alt || `Carousel image ${index + 1}`}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  borderRadius,
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
