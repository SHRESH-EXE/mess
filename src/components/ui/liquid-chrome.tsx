import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface LiquidChromeProps {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uBaseColor;
uniform float uAmplitude;
uniform vec2 uResolution;
varying vec2 vUv;

// Simplex-like noise helper
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = vUv * 2.0 - 1.0;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  st.x *= aspect;

  float t = uTime * 0.5;
  float n1 = snoise(st * 2.0 + vec2(t * 0.4, t * 0.3));
  float n2 = snoise(st * 3.5 - vec2(t * 0.5, -t * 0.2) + n1 * uAmplitude);
  
  float chrome = sin((n1 + n2) * 4.0 + t);
  chrome = pow(abs(chrome), 0.7);

  vec3 col = uBaseColor + vec3(chrome * 0.4);
  // Highlights
  col += vec3(pow(max(0.0, chrome), 3.0) * 0.6);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function LiquidChrome({
  baseColor = [0.039, 0.039, 0.039],
  speed = 1,
  amplitude = 0.1,
  interactive = false,
  className = '',
  style = {}
}: LiquidChromeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let animationId: number;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uBaseColor: { value: baseColor },
          uAmplitude: { value: amplitude },
          uResolution: { value: [container.clientWidth || 100, container.clientHeight || 40] }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });
      container.appendChild(gl.canvas);
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.display = 'block';

      const handleResize = () => {
        if (!container || !renderer) return;
        const width = container.clientWidth || 100;
        const height = container.clientHeight || 40;
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [width, height];
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      let lastTime = performance.now();
      const update = (time: number) => {
        const delta = (time - lastTime) * 0.001;
        lastTime = time;
        program.uniforms.uTime.value += delta * speed;
        renderer?.render({ scene: mesh });
        animationId = requestAnimationFrame(update);
      };

      animationId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        if (gl.canvas.parentElement) {
          gl.canvas.parentElement.removeChild(gl.canvas);
        }
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    } catch (e) {
      console.warn('WebGL / LiquidChrome not supported', e);
    }
  }, [baseColor, speed, amplitude]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${className}`}
      style={{ pointerEvents: interactive ? 'auto' : 'none', ...style }}
    />
  );
}
