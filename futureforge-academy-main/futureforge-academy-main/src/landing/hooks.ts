import { useEffect, useState, type RefObject } from "react";
import type { Context } from "gsap";

import {
  HERO_FRAME_COUNT,
  HERO_MOBILE_SPRITE,
  HERO_STORY_START_FRAME,
  heroFrameSrc,
  navLinks,
} from "./data";

const NAV_SECTION_IDS = navLinks.map((link) => link.href.replace("#", ""));

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useScrolledNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrolled;
}

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let frame = 0;

    const getSections = () =>
      NAV_SECTION_IDS.map((id) => document.getElementById(id)).filter(
        (section): section is HTMLElement => Boolean(section),
      );

    const updateActiveSection = () => {
      frame = 0;

      const sections = getSections();
      if (!sections.length) return;

      const activationLine = window.scrollY + 116;
      const nearPageEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      let nextSection = sections[0].id;

      for (const section of sections) {
        if (section.offsetTop <= activationLine) {
          nextSection = section.id;
        } else {
          break;
        }
      }

      if (nearPageEnd) {
        nextSection = sections[sections.length - 1].id;
      }

      setActiveSection((current) => (current === nextSection ? current : nextSection));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("load", requestUpdate);
    };
  }, []);

  return activeSection;
}

export function useLenisScroll(pageRef: RefObject<HTMLElement | null>, reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches) return;

    let disposed = false;
    let destroyLenis: (() => void) | undefined;

    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (disposed) return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
          lerp: 0.08,
          smoothWheel: true,
          wheelMultiplier: 0.92,
        });

        const tick = (time: number) => lenis.raf(time * 1000);
        const updateScrollTrigger = () => ScrollTrigger.update();
        const onAnchorClick = (event: MouseEvent) => {
          const target = event.target;
          const anchor =
            target instanceof Element ? target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
          const href = anchor?.getAttribute("href");

          if (!href || href === "#") return;

          const destination = document.querySelector<HTMLElement>(href);
          if (!destination) return;

          event.preventDefault();
          lenis.scrollTo(destination, { offset: -92, duration: 1.08 });
        };

        lenis.on("scroll", updateScrollTrigger);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        pageRef.current?.addEventListener("click", onAnchorClick);

        destroyLenis = () => {
          pageRef.current?.removeEventListener("click", onAnchorClick);
          gsap.ticker.remove(tick);
          lenis.off("scroll", updateScrollTrigger);
          lenis.destroy();
        };
      },
    );

    return () => {
      disposed = true;
      destroyLenis?.();
    };
  }, [pageRef, reducedMotion]);
}

type HeroFrameRenderer = {
  destroy: () => void;
  resize: () => void;
  setProgress: (progress: number, velocity: number) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function drawCoverFrame(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;

  if (!imageWidth || !imageHeight || !width || !height) return;

  const scale = Math.max(width / imageWidth, height / imageHeight);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function drawCoverSpriteFrame(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  sourceHeight: number,
  width: number,
  height: number,
) {
  if (!sourceWidth || !sourceHeight || !width || !height) return;

  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    drawWidth,
    drawHeight,
  );
}

function createHeroMobileSpriteRenderer(
  canvas: HTMLCanvasElement,
  layer: HTMLElement,
): HeroFrameRenderer | undefined {
  const context = canvas.getContext("2d", { alpha: true });

  if (!context) return undefined;

  const image = new Image();
  let canvasWidth = 0;
  let canvasHeight = 0;
  let currentFrame = 0;
  let imageReady = false;
  let disposed = false;

  image.decoding = "async";
  if ("fetchPriority" in image) {
    image.fetchPriority = "high";
  }

  const drawFrame = () => {
    if (!imageReady || !canvasWidth || !canvasHeight) return;

    const column = currentFrame % HERO_MOBILE_SPRITE.columns;
    const row = Math.floor(currentFrame / HERO_MOBILE_SPRITE.columns);

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    drawCoverSpriteFrame(
      context,
      image,
      column * HERO_MOBILE_SPRITE.frameWidth,
      row * HERO_MOBILE_SPRITE.frameHeight,
      HERO_MOBILE_SPRITE.frameWidth,
      HERO_MOBILE_SPRITE.frameHeight,
      canvasWidth,
      canvasHeight,
    );
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
    const nextWidth = Math.max(1, Math.round(rect.width * pixelRatio));
    const nextHeight = Math.max(1, Math.round(rect.height * pixelRatio));

    if (nextWidth === canvasWidth && nextHeight === canvasHeight) return;

    canvasWidth = nextWidth;
    canvasHeight = nextHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    drawFrame();
  };

  image.onload = () => {
    if (disposed) return;
    imageReady = true;
    drawFrame();
  };
  image.onerror = () => {
    canvas.style.display = "none";
  };
  image.src = HERO_MOBILE_SPRITE.src;

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  return {
    destroy: () => {
      disposed = true;
      resizeObserver.disconnect();
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    resize,
    setProgress: (progress, velocity) => {
      const nextFrame = Math.round(clamp(progress, 0, 1) * (HERO_MOBILE_SPRITE.frameCount - 1));
      const velocityBoost = clamp(Math.abs(velocity) / 3600, 0, 1);

      layer.style.setProperty(
        "--velocity-glow",
        clamp(0.08 + velocityBoost * 0.24, 0.08, 0.32).toFixed(3),
      );
      layer.style.setProperty("--chromatic-shift", `${clamp(velocityBoost, 0, 1).toFixed(2)}px`);

      if (nextFrame === currentFrame) return;

      currentFrame = nextFrame;
      drawFrame();
    },
  };
}

function createHeroFrameRenderer(
  canvas: HTMLCanvasElement,
  layer: HTMLElement,
): HeroFrameRenderer | undefined {
  const context = canvas.getContext("2d", { alpha: true });

  if (!context) return undefined;

  const frameCache = new Map<number, HTMLImageElement>();
  const loadingFrames = new Set<number>();
  const loadingFrameImages = new Map<number, HTMLImageElement>();
  const frameLoadPromises = new Map<number, Promise<void>>();
  const pendingFrameLoads = new Map<
    number,
    { fetchPriority: "auto" | "high" | "low"; resolve: () => void }
  >();
  const queuedFrames = new Set<number>();
  const frameLoadQueue: number[] = [];
  const isCompactViewport = window.matchMedia("(max-width: 768px)").matches;
  const maxConcurrentFrameLoads = isCompactViewport ? 3 : 5;
  const pixelRatioLimit = isCompactViewport ? 1.22 : 1.65;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let currentFrame = 1;
  let targetFrame = 1;
  let velocityIntensity = 0;
  let animationFrame = 0;
  let hasPreloaded = false;
  let lastPreloadCenter = 0;
  let activeFrameLoads = 0;
  let disposed = false;

  const getCachedFrame = (index: number) => {
    const image = frameCache.get(index);
    return image?.complete && image.naturalWidth > 0 ? image : undefined;
  };

  const promoteQueuedFrame = (index: number, fetchPriority: "auto" | "high" | "low") => {
    const queuedIndex = frameLoadQueue.indexOf(index);
    if (queuedIndex === -1) return;

    frameLoadQueue.splice(queuedIndex, 1);
    if (fetchPriority === "high") {
      frameLoadQueue.unshift(index);
    } else {
      frameLoadQueue.push(index);
    }
  };

  const pumpFrameQueue = () => {
    if (disposed) return;

    while (activeFrameLoads < maxConcurrentFrameLoads && frameLoadQueue.length) {
      const normalizedIndex = frameLoadQueue.shift();
      if (!normalizedIndex) continue;

      queuedFrames.delete(normalizedIndex);

      const pendingLoad = pendingFrameLoads.get(normalizedIndex);
      if (!pendingLoad || frameCache.has(normalizedIndex)) {
        pendingLoad?.resolve();
        pendingFrameLoads.delete(normalizedIndex);
        continue;
      }

      activeFrameLoads += 1;

      const image = new Image();
      image.decoding = "async";
      if ("fetchPriority" in image) {
        image.fetchPriority = pendingLoad.fetchPriority;
      }
      loadingFrameImages.set(normalizedIndex, image);

      const finishLoad = () => {
        activeFrameLoads = Math.max(0, activeFrameLoads - 1);
        loadingFrames.delete(normalizedIndex);
        loadingFrameImages.delete(normalizedIndex);
        pendingFrameLoads.delete(normalizedIndex);
        pendingLoad.resolve();
        pumpFrameQueue();
      };

      image.onload = () => {
        frameCache.set(normalizedIndex, image);
        if (
          normalizedIndex === HERO_STORY_START_FRAME ||
          Math.abs(normalizedIndex - currentFrame) <= 2
        ) {
          drawFrame();
        }
        finishLoad();
      };
      image.onerror = finishLoad;
      image.src = heroFrameSrc(normalizedIndex);
    }
  };

  const loadFrame = (index: number, fetchPriority: "auto" | "high" | "low" = "auto") => {
    const normalizedIndex = Math.round(clamp(index, 1, HERO_FRAME_COUNT));

    if (frameCache.has(normalizedIndex)) return Promise.resolve();

    const existingLoad = frameLoadPromises.get(normalizedIndex);
    if (existingLoad) {
      const pendingLoad = pendingFrameLoads.get(normalizedIndex);
      if (pendingLoad && fetchPriority === "high") {
        pendingLoad.fetchPriority = "high";
        promoteQueuedFrame(normalizedIndex, fetchPriority);
        pumpFrameQueue();
      }
      return existingLoad;
    }

    loadingFrames.add(normalizedIndex);

    const frameLoad = new Promise<void>((resolve) => {
      pendingFrameLoads.set(normalizedIndex, { fetchPriority, resolve });
    });

    frameLoadPromises.set(normalizedIndex, frameLoad);
    queuedFrames.add(normalizedIndex);
    if (fetchPriority === "high") {
      frameLoadQueue.unshift(normalizedIndex);
    } else {
      frameLoadQueue.push(normalizedIndex);
    }
    pumpFrameQueue();

    return frameLoad;
  };

  const preloadAround = (
    center: number,
    radius: number,
    fetchPriority: "auto" | "high" | "low" = "auto",
  ) => {
    const normalizedCenter = Math.round(clamp(center, 1, HERO_FRAME_COUNT));

    loadFrame(normalizedCenter, fetchPriority);

    for (let offset = 1; offset <= radius; offset += 1) {
      loadFrame(normalizedCenter + offset, fetchPriority);
      loadFrame(normalizedCenter - offset, fetchPriority);
    }
  };

  const scheduleBackgroundPreload = () => {
    const preload = () => {
      if (!disposed) preloadAround(HERO_STORY_START_FRAME, isCompactViewport ? 5 : 14, "low");
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preload, { timeout: 1600 });
      return;
    }

    window.setTimeout(preload, 700);
  };

  const findNearestLoadedFrame = (frame: number) => {
    const rounded = Math.round(clamp(frame, 1, HERO_FRAME_COUNT));

    for (let distance = 0; distance <= 34; distance += 1) {
      const lower = getCachedFrame(rounded - distance);
      if (lower) return lower;

      const upper = getCachedFrame(rounded + distance);
      if (upper) return upper;
    }

    return undefined;
  };

  const drawFrame = () => {
    if (!canvasWidth || !canvasHeight) return;

    const frameIndex = Math.round(clamp(currentFrame, 1, HERO_FRAME_COUNT));
    const fallbackImage = getCachedFrame(frameIndex) ?? findNearestLoadedFrame(frameIndex);

    if (!fallbackImage) return;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    drawCoverFrame(context, fallbackImage, canvasWidth, canvasHeight);
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, pixelRatioLimit);
    const nextWidth = Math.max(1, Math.round(rect.width * pixelRatio));
    const nextHeight = Math.max(1, Math.round(rect.height * pixelRatio));

    if (nextWidth === canvasWidth && nextHeight === canvasHeight) return;

    canvasWidth = nextWidth;
    canvasHeight = nextHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    drawFrame();
  };

  const render = () => {
    if (disposed) return;

    currentFrame = targetFrame;
    layer.style.setProperty(
      "--velocity-glow",
      clamp(0.08 + velocityIntensity * 0.32, 0.08, 0.4).toFixed(3),
    );
    layer.style.setProperty(
      "--chromatic-shift",
      `${clamp(velocityIntensity * 2, 0, 2).toFixed(2)}px`,
    );

    drawFrame();
    velocityIntensity *= 0.9;
    animationFrame = window.requestAnimationFrame(render);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  loadFrame(HERO_STORY_START_FRAME, "high").then(drawFrame);
  scheduleBackgroundPreload();
  animationFrame = window.requestAnimationFrame(render);

  return {
    destroy: () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      frameCache.clear();
      loadingFrames.clear();
      loadingFrameImages.clear();
      pendingFrameLoads.clear();
      queuedFrames.clear();
      frameLoadQueue.length = 0;
      frameLoadPromises.clear();
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    resize,
    setProgress: (progress, velocity) => {
      const sequenceProgress = clamp(progress, 0, 1);
      const velocityDirection = velocity >= 0 ? 1 : -1;
      const velocityBoost = clamp(Math.abs(velocity) / 3600, 0, 1);
      const nextFrame = Math.round(1 + sequenceProgress * (HERO_FRAME_COUNT - 1));
      const frameStep = isCompactViewport ? 4 : 1;
      const requestedFrame = Math.round(clamp(nextFrame, 1, HERO_FRAME_COUNT) / frameStep) * frameStep;
      const preloadRadius = (isCompactViewport ? 3 : 12) + Math.round(velocityBoost * 6);
      const preloadThreshold = isCompactViewport ? 12 : 4;

      targetFrame = clamp(requestedFrame, 1, HERO_FRAME_COUNT);
      velocityIntensity = Math.max(velocityIntensity, velocityBoost);

      if (!hasPreloaded) {
        hasPreloaded = true;
        preloadAround(HERO_STORY_START_FRAME, isCompactViewport ? 5 : 10, "high");
      }

      if (Math.abs(targetFrame - lastPreloadCenter) >= preloadThreshold) {
        lastPreloadCenter = targetFrame;
        preloadAround(targetFrame, preloadRadius, "high");
      } else {
        loadFrame(targetFrame, "high");
      }

      if (velocityBoost > 0.42) {
        preloadAround(
          targetFrame + velocityDirection * preloadRadius,
          Math.ceil(preloadRadius * 0.55),
          "high",
        );
      }
    },
  };
}

export function useLandingMotion(pageRef: RefObject<HTMLElement | null>, reducedMotion: boolean) {
  useEffect(() => {
    const page = pageRef.current;
    if (!page || reducedMotion) return;

    let animationContext: Context | undefined;
    let disposed = false;
    const cleanups: Array<() => void> = [];

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;

        gsap.registerPlugin(ScrollTrigger);

        animationContext = gsap.context(() => {
          const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
          const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
          const isCompactExperience = !isDesktop || window.matchMedia("(pointer: coarse)").matches;
          const formatCount = (raw: string, value: number) => {
            const suffix = raw.replace(/[\d.]/g, "");
            const rounded = Math.round(value);

            return `${rounded}${suffix}`;
          };

          if (!isCompactExperience) {
            gsap.utils.toArray<HTMLElement>("main > section").forEach((section) => {
              gsap.fromTo(
                section,
                { filter: "brightness(0.74) blur(9px)", scale: 0.965 },
                {
                  ease: "power3.out",
                  filter: "brightness(1) blur(0px)",
                  scale: 1,
                  scrollTrigger: {
                    end: "top 36%",
                    scrub: 0.9,
                    start: "top 92%",
                    trigger: section,
                  },
                },
              );
            });
          }

          const hero = page.querySelector<HTMLElement>("[data-hero-story]");
          const heroCover = page.querySelector<HTMLElement>("[data-hero-cover]");
          const heroCopy = page.querySelector<HTMLElement>("[data-hero-copy]");
          const heroCanvas = page.querySelector<HTMLCanvasElement>("[data-hero-frame-canvas]");
          const cinematicLayer = page.querySelector<HTMLElement>("[data-cinematic-frame-layer]");
          const heroDissolve = page.querySelector<HTMLElement>("[data-hero-dissolve]");
          const storyProgress = page.querySelector<HTMLElement>("[data-story-progress]");
          const heroAtmosphere = hero
            ? gsap.utils.toArray<HTMLElement>(".hero-ghost-word, .hero-light-streak", hero)
            : [];
          const frameRenderer =
            heroCanvas && cinematicLayer
              ? isCompactExperience
                ? createHeroMobileSpriteRenderer(heroCanvas, cinematicLayer)
                : createHeroFrameRenderer(heroCanvas, cinematicLayer)
              : undefined;

          if (frameRenderer) {
            cleanups.push(frameRenderer.destroy);
          }

          if (hero && heroCover && heroCopy && cinematicLayer && frameRenderer) {
            gsap.set(cinematicLayer, {
              autoAlpha: 0,
              rotateX: 3,
              rotateY: -4,
              scale: 1.16,
              transformOrigin: "50% 52%",
            });
            gsap.set(storyProgress, { scaleX: 0, transformOrigin: "left center" });

            const cinematicTimeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                anticipatePin: 1,
                end: () =>
                  `+=${Math.round(
                    Math.max(
                      window.innerHeight * (isDesktop ? 5.6 : 5),
                      HERO_FRAME_COUNT * (isDesktop ? 16 : 12),
                    ),
                  )}`,
                invalidateOnRefresh: true,
                onRefresh: frameRenderer.resize,
                onUpdate: (self) => {
                  const progress = self.progress;
                  const frameProgress = clamp((progress - 0.2) / 0.76, 0, 1);
                  const velocity = self.getVelocity();
                  const velocityGlow = clamp(Math.abs(velocity) / 4200, 0, 1);

                  hero.style.setProperty("--cinematic-progress", progress.toFixed(4));
                  cinematicLayer.style.setProperty("--sequence-progress", frameProgress.toFixed(4));
                  cinematicLayer.style.setProperty("--velocity-glow", velocityGlow.toFixed(3));
                  if (progress > 0.18) {
                    frameRenderer.setProgress(frameProgress, velocity);
                  }
                },
                pin: true,
                scrub: 0.52,
                start: "top top",
                trigger: hero,
              },
            });

            cinematicTimeline
              .to(
                heroCover,
                {
                  duration: 0.24,
                  ease: "power4.out",
                  filter: "blur(1px) saturate(1.12) brightness(0.96)",
                  scale: 1.2,
                  yPercent: -2,
                },
                0,
              )
              .to(
                heroCopy,
                {
                  duration: 0.24,
                  ease: "power4.out",
                  scale: 1.045,
                  yPercent: -3,
                },
                0,
              )
              .to(
                heroAtmosphere,
                {
                  autoAlpha: 0,
                  duration: 0.26,
                  ease: "power2.inOut",
                  filter: "blur(18px)",
                },
                0.16,
              )
              .to(
                heroCopy,
                {
                  autoAlpha: 0,
                  duration: 0.34,
                  ease: "power3.inOut",
                  filter: isCompactExperience ? "blur(12px)" : "blur(26px)",
                  scale: 0.92,
                  yPercent: -18,
                },
                0.2,
              )
              .to(
                heroCover,
                {
                  duration: 0.38,
                  ease: "expo.inOut",
                  filter: isCompactExperience
                    ? "blur(10px) saturate(1.22) brightness(0.62)"
                    : "blur(22px) saturate(1.45) brightness(0.52)",
                  opacity: 0.2,
                  scale: 1.58,
                  yPercent: -5,
                },
                0.2,
              )
              .fromTo(
                heroDissolve,
                { autoAlpha: 0, scale: 0.86 },
                {
                  autoAlpha: 1,
                  duration: 0.28,
                  ease: "power2.out",
                  scale: 1.18,
                },
                0.18,
              )
              .to(
                cinematicLayer,
                {
                  autoAlpha: 1,
                  duration: 0.42,
                  ease: "expo.inOut",
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1.02,
                },
                0.24,
              )
              .to(
                storyProgress,
                {
                  duration: 0.72,
                  scaleX: 1,
                },
                0.28,
              )
              .to(
                heroDissolve,
                {
                  autoAlpha: 0,
                  duration: 0.28,
                  ease: "power2.in",
                  scale: 1.42,
                },
                0.4,
              )
              .to(
                cinematicLayer,
                {
                  duration: 0.34,
                  ease: "sine.inOut",
                  scale: 1.075,
                },
                0.44,
              )
              .to(
                cinematicLayer,
                {
                  duration: 0.22,
                  ease: "power3.out",
                  scale: 1,
                },
                0.82,
              );
          }

          if (isCompactExperience) {
            gsap.utils.toArray<HTMLElement>("[data-count-value]").forEach((element) => {
              element.textContent = element.dataset.countValue ?? element.textContent;
            });

            return;
          }

          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
            const delay = Number(element.dataset.revealDelay ?? 0);

            gsap.fromTo(
              element,
              { autoAlpha: 0, filter: "blur(14px)", y: 44 },
              {
                autoAlpha: 1,
                delay,
                duration: 1,
                ease: "power4.out",
                filter: "blur(0px)",
                scrollTrigger: {
                  trigger: element,
                  start: "top 84%",
                  once: true,
                },
                y: 0,
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
            const children = gsap.utils.toArray<HTMLElement>("[data-reveal-child]", group);
            if (!children.length) return;

            gsap.fromTo(
              children,
              { autoAlpha: 0, filter: "blur(12px)", y: 32 },
              {
                autoAlpha: 1,
                duration: 1,
                ease: "power4.out",
                filter: "blur(0px)",
                scrollTrigger: {
                  trigger: group,
                  start: "top 84%",
                  once: true,
                },
                stagger: 0.085,
                y: 0,
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-split-text]").forEach((element) => {
            const words = gsap.utils.toArray<HTMLElement>(".kinetic-word", element);
            if (!words.length) return;

            gsap.fromTo(
              words,
              { autoAlpha: 0, filter: "blur(12px)", rotateX: 48, yPercent: 72 },
              {
                autoAlpha: 1,
                duration: 0.8,
                ease: "power4.out",
                filter: "blur(0px)",
                rotateX: 0,
                scrollTrigger: {
                  trigger: element,
                  start: "top 82%",
                  once: true,
                },
                stagger: 0.035,
                yPercent: 0,
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
            gsap.to(element, {
              ease: "none",
              scrollTrigger: {
                end: "bottom top",
                scrub: 0.8,
                start: "top bottom",
                trigger: element.parentElement ?? element,
              },
              yPercent: Number(element.dataset.parallax ?? -8),
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-rail-fill]").forEach((element) => {
            gsap.fromTo(
              element,
              { scaleY: 0 },
              {
                ease: "none",
                scaleY: 1,
                scrollTrigger: {
                  end: "bottom 42%",
                  scrub: 0.8,
                  start: "top 76%",
                  trigger: element.closest("[data-academy-band]") ?? element,
                },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((element, index) => {
            gsap.fromTo(
              element,
              { autoAlpha: 0, filter: "blur(10px)", scale: 0.94, y: 30 },
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                delay: index * 0.055,
                duration: 0.9,
                ease: "power4.out",
                scale: 1,
                scrollTrigger: {
                  trigger: element,
                  start: "top 88%",
                  once: true,
                },
                y: 0,
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-count-value]").forEach((element) => {
            const raw = element.dataset.countValue ?? "0";
            const target = Number.parseFloat(raw.replace(/[^\d.]/g, "")) || 0;
            const state = { value: 0 };

            gsap.to(state, {
              duration: 1.55,
              ease: "power3.out",
              onUpdate: () => {
                element.textContent = formatCount(raw, state.value);
              },
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
              value: target,
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-academy-band]").forEach((element, index) => {
            ScrollTrigger.create({
              end: "bottom 42%",
              start: "top 58%",
              toggleClass: { targets: element, className: "academy-band-active" },
              trigger: element,
            });

            gsap.fromTo(
              element,
              { filter: "brightness(0.72) blur(12px)", rotateX: 8, scale: 0.94, y: 80 },
              {
                duration: 1.08,
                ease: "power4.out",
                filter: "brightness(1) blur(0px)",
                rotateX: 0,
                scale: 1,
                scrollTrigger: {
                  start: "top 82%",
                  trigger: element,
                },
                y: 0,
                delay: index * 0.045,
              },
            );
          });

          const courseStory = page.querySelector<HTMLElement>("[data-course-story]");
          const courseCards = gsap.utils.toArray<HTMLElement>("[data-course-card]");

          if (courseStory && courseCards.length) {
            gsap.fromTo(
              courseCards,
              { autoAlpha: 0, rotateX: 12, scale: 0.94, y: 82 },
              {
                autoAlpha: 1,
                duration: 0.9,
                ease: "power3.out",
                rotateX: 0,
                scale: 1,
                scrollTrigger: {
                  start: "top 76%",
                  trigger: courseStory,
                },
                stagger: { amount: 0.5, from: "center" },
                y: 0,
              },
            );

            if (isDesktop) {
              gsap.to(courseCards, {
                ease: "none",
                scrollTrigger: {
                  end: "bottom top",
                  scrub: 1.1,
                  start: "top bottom",
                  trigger: courseStory,
                },
                yPercent: (index) => (index % 2 === 0 ? -5 : 5),
              });
            }
          }

          gsap.utils.toArray<HTMLElement>(".gallery-card").forEach((element, index) => {
            gsap.fromTo(
              element,
              { clipPath: "inset(10% round 28px)", y: 34 },
              {
                clipPath: "inset(0% round 28px)",
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                  start: "top 84%",
                  trigger: element,
                },
                y: 0,
                delay: index * 0.035,
              },
            );
          });

          if (canHover) {
            const updateCursor = (event: MouseEvent) => {
              page.style.setProperty("--cursor-x", `${event.clientX}px`);
              page.style.setProperty("--cursor-y", `${event.clientY}px`);
            };

            page.addEventListener("pointermove", updateCursor, { passive: true });
            cleanups.push(() => page.removeEventListener("pointermove", updateCursor));

            gsap.utils
              .toArray<HTMLElement>(".glass-panel, .glass-strong, .course-card, .image-frame")
              .forEach((element) => {
                const updateReflection = (event: MouseEvent) => {
                  const rect = element.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width) * 100;
                  const y = ((event.clientY - rect.top) / rect.height) * 100;

                  element.style.setProperty("--spot-x", `${x}%`);
                  element.style.setProperty("--spot-y", `${y}%`);
                };

                element.addEventListener("pointermove", updateReflection, { passive: true });
                cleanups.push(() => element.removeEventListener("pointermove", updateReflection));
              });

            gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((element) => {
              const onMove = (event: MouseEvent) => {
                const rect = element.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;

                gsap.to(element, {
                  duration: 0.35,
                  ease: "power3.out",
                  x: x * 0.12,
                  y: y * 0.16,
                });
              };
              const onLeave = () => {
                gsap.to(element, {
                  duration: 0.5,
                  ease: "elastic.out(1, 0.45)",
                  x: 0,
                  y: 0,
                });
              };

              element.addEventListener("mousemove", onMove);
              element.addEventListener("mouseleave", onLeave);
              cleanups.push(() => {
                element.removeEventListener("mousemove", onMove);
                element.removeEventListener("mouseleave", onLeave);
              });
            });
          }
        }, page);

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);
        cleanups.push(() => window.removeEventListener("load", refresh));

        window.setTimeout(refresh, 120);
      },
    );

    return () => {
      disposed = true;
      cleanups.forEach((cleanup) => cleanup());
      animationContext?.revert();
    };
  }, [pageRef, reducedMotion]);
}
