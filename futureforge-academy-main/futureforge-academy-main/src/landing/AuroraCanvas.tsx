import { useEffect, useRef } from "react";

type AuroraCanvasProps = {
  reducedMotion: boolean;
};

export function AuroraCanvas({ reducedMotion }: AuroraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let disposed = false;
    let animationFrame = 0;
    let cleanup: (() => void) | undefined;
    let timeoutId = 0;
    let idleCallbackId = 0;

    const loadAurora = () => {
      import("three")
      .then((THREE) => {
        if (disposed || !canvas) return;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          canvas,
          powerPreference: "low-power",
        });

        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const uniforms = {
          uResolution: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
        };
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
          depthWrite: false,
          transparent: true,
          uniforms,
          vertexShader: `
            varying vec2 vUv;

            void main() {
              vUv = uv;
              gl_Position = vec4(position.xy, 0.0, 1.0);
            }
          `,
          fragmentShader: `
            precision highp float;

            varying vec2 vUv;
            uniform vec2 uResolution;
            uniform float uTime;

            float hash(vec2 p) {
              return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            float noise(vec2 p) {
              vec2 i = floor(p);
              vec2 f = fract(p);
              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(
                mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
                u.y
              );
            }

            void main() {
              vec2 uv = vUv;
              vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
              float t = uTime * 0.08;
              float ribbonA = smoothstep(0.5, 0.0, abs(p.y - sin((p.x + t) * 2.2) * 0.18));
              float ribbonB = smoothstep(0.58, 0.0, abs(p.y + cos((p.x - t * 1.2) * 2.7) * 0.14));
              float n = noise(uv * 7.0 + t * 2.0);
              vec3 cyan = vec3(0.0, 0.9, 1.0);
              vec3 purple = vec3(0.48, 0.38, 1.0);
              vec3 pink = vec3(1.0, 0.31, 0.85);
              vec3 color = cyan * ribbonA + purple * ribbonB + pink * ribbonA * ribbonB;
              float vignette = smoothstep(0.92, 0.18, length(p));
              float alpha = (ribbonA + ribbonB) * 0.18 * vignette + n * 0.018;
              gl_FragColor = vec4(color, alpha);
            }
          `,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const resize = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          renderer.setSize(width, height, false);
          uniforms.uResolution.value.set(width, height);
        };

        const render = () => {
          if (disposed) return;

          uniforms.uTime.value += 1;
          renderer.render(scene, camera);
          animationFrame = window.requestAnimationFrame(render);
        };

        resize();
        render();
        window.addEventListener("resize", resize);

        cleanup = () => {
          window.removeEventListener("resize", resize);
          window.cancelAnimationFrame(animationFrame);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
      })
      .catch(() => {
        canvas.style.display = "none";
      });
    };

    if ("requestIdleCallback" in window) {
      idleCallbackId = window.requestIdleCallback(loadAurora, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(loadAurora, 900);
    }

    return () => {
      disposed = true;
      if (idleCallbackId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      cleanup?.();
    };
  }, [reducedMotion]);

  return (
    <>
      <div className="ambient-fallback" aria-hidden="true" />
      <canvas ref={canvasRef} className="aurora-canvas" aria-hidden="true" />
    </>
  );
}
