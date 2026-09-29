'use client';

/**
 * NexumBackground
 * Interactive 3D hero background: a frosted-glass core tethered to 8 team nodes.
 *
 * Deps: react, three (>= r152), @react-three/fiber (v9 for React 19). No drei needed.
 * Import it via NexumBackgroundLoader.tsx (client-only, no SSR).
 * Mouse/scroll are read from `window`, so the canvas can sit behind your hero
 * content with pointer-events: none and still respond.
 */

import { Component, useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ───────────────────────── Tunables ───────────────────────── */
const EMERALD = '#10B981';
const NODE_COUNT = 8;
const ORBIT_RADIUS = 2.6;
const CORE_RADIUS = 1.35;
const NODE_RADIUS = 0.3;
const MAX_TILT = THREE.MathUtils.degToRad(15); // cursor parallax, ±15°
const IDLE_AMPLITUDE = 0.07; // rad, idle "breathing" on X/Y
const HOVER_RADIUS = 0.55; // world units from cursor ray to count as a direct hover
const ROW_Y = -0.3; // scroll state: rail height, as a fraction of viewport height

// Swap these for real names/roles: one micro-label per node.
const DEFAULT_LABELS = [
  'The Architect',
  'The Spark',
  'The Anchor',
  'The Navigator',
  'The Storyteller',
  'The Builder',
  'The Catalyst',
  'The Strategist',
];

/* ───────────────────────── Static layout ───────────────────────── */
// Node 0 sits at 12 o'clock, then clockwise. Even = cardinal, odd = diagonal.
const ORBIT = Array.from({ length: NODE_COUNT }, (_, i) => {
  const a = Math.PI / 2 - (i * Math.PI * 2) / NODE_COUNT;
  return new THREE.Vector3(
    Math.cos(a) * ORBIT_RADIUS,
    Math.sin(a) * ORBIT_RADIUS,
    i % 2 === 0 ? 0.35 : -0.35,
  );
});
const DIRS = ORBIT.map((o) => new THREE.Vector3(o.x, o.y, 0).normalize());
// Where a spoke meets the octahedron: vertex for cardinals, edge midpoint for diagonals.
const REACH = ORBIT.map((_, i) => (i % 2 === 0 ? CORE_RADIUS : CORE_RADIUS * 0.72));

type Input = { 
  x: number; y: number; active: boolean; scroll: number; reduced: boolean;
  hoveredNode: number;
  dragging: boolean; lastClientX: number; lastClientY: number;
  dragRotX: number; dragRotY: number;
};

type Props = {
  /** Micro-labels shown on node hover (8 expected). */
  labels?: string[];
  /** Positioning classes for the wrapper. Use "absolute inset-0" to scope it to the hero. */
  className?: string;
  /** Scroll distance (in viewport heights) over which the polyhedron deconstructs. */
  scrollRange?: number;
};

/* If WebGL or three fails, fall back to the plain gradient instead of crashing the page. */
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('[NexumBackground] 3D disabled:', err);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* ───────────────────────── Root component ───────────────────────── */
export default function NexumBackground({
  labels = DEFAULT_LABELS,
  className = 'fixed inset-0 -z-10',
  scrollRange = 0.9,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const input = useRef<Input>({ 
    x: 0, y: 0, active: false, scroll: 0, reduced: false,
    hoveredNode: -1, dragging: false, lastClientX: 0, lastClientY: 0,
    dragRotX: 0, dragRotY: 0
  });

  useEffect(() => {
    const s = input.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      s.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      s.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      s.active = true;

      if (s.dragging) {
        const dx = e.clientX - s.lastClientX;
        const dy = e.clientY - s.lastClientY;
        s.dragRotY += dx * 0.005;
        s.dragRotX += dy * 0.005;
        s.lastClientX = e.clientX;
        s.lastClientY = e.clientY;
      }
    };
    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) Object.assign(s, { x: 0, y: 0, active: false, dragging: false });
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (s.hoveredNode >= 0) {
        s.dragging = true;
        s.lastClientX = e.clientX;
        s.lastClientY = e.clientY;
        document.body.style.cursor = 'grabbing';
      }
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (s.dragging) {
        s.dragging = false;
        document.body.style.cursor = '';
      }
    };
    const onScroll = () => {
      s.scroll = THREE.MathUtils.clamp(window.scrollY / (window.innerHeight * scrollRange), 0, 1);
    };

    onScroll();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerout', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerout', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.body.style.cursor = '';
    };
  }, [scrollRange]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`${className} select-none overflow-hidden`}
      style={{
        // Matte carbon-black base with a faint emerald lift behind the constellation
        background:
          'radial-gradient(ellipse 60% 70% at 72% 48%, #0c1512 0%, #0a0a0a 55%, #060606 100%)',
      }}
    >
      <Boundary>
        <Canvas
          flat
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 9], fov: 40, near: 0.1, far: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Constellation input={input} labelRef={labelRef} labels={labels} />
        </Canvas>
      </Boundary>

      {/* Top-left darkening so hero text keeps its contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(120deg, rgba(3,3,3,0.85) 0%, rgba(3,3,3,0.45) 32%, transparent 62%)',
        }}
      />

      <div
        ref={labelRef}
        className="absolute left-0 top-0 whitespace-nowrap rounded border border-emerald-500/40 bg-black/60 px-2.5 py-1 text-xs font-medium tracking-wide text-emerald-300 opacity-0 backdrop-blur transition-opacity duration-200 will-change-transform"
      />
    </div>
  );
}

/* ───────────────────────── Helpers ───────────────────────── */
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(110,231,183,1)');
  g.addColorStop(0.3, 'rgba(16,185,129,0.4)');
  g.addColorStop(1, 'rgba(16,185,129,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function dynamicSegments(count: number) {
  const geo = new THREE.BufferGeometry();
  const attr = new THREE.BufferAttribute(new Float32Array(count * 6), 3);
  attr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', attr);
  return geo;
}

function circle(radius: number) {
  const pts = Array.from({ length: 128 }, (_, i) => {
    const a = (i / 128) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  });
  return new THREE.BufferGeometry().setFromPoints(pts);
}

/* ───────────────────────── Scene ───────────────────────── */
function Constellation({
  input,
  labelRef,
  labels,
}: {
  input: RefObject<Input>;
  labelRef: RefObject<HTMLDivElement | null>;
  labels: string[];
}) {
  const { gl, scene } = useThree();

  const root = useRef<THREE.Group>(null); // screen position + responsive scale
  const tilt = useRef<THREE.Group>(null); // parallax + idle rotation
  const core = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Sprite>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const dust = useRef<THREE.Group>(null);
  const nodes = useRef<(THREE.Group | null)[]>([]);
  const halos = useRef<(THREE.Sprite | null)[]>([]);

  const st = useRef({
    p: 0, // smoothed scroll progress
    x: 0, // smoothed cursor
    y: 0,
    label: -1,
    hover: new Float32Array(NODE_COUNT),
    lift: new Float32Array(NODE_COUNT),
    dist: new Float32Array(NODE_COUNT),
  });
  const tmp = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      ndc: new THREE.Vector2(),
      w: new THREE.Vector3(),
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      c: new THREE.Vector3(),
    }),
    [],
  );

  const glowTex = useMemo(makeGlowTexture, []);

  const geo = useMemo(() => {
    const coreGeo = new THREE.OctahedronGeometry(CORE_RADIUS, 0);
    const R = CORE_RADIUS;
    const hex = new THREE.CylinderGeometry(NODE_RADIUS, NODE_RADIUS, 0.08, 6);
    hex.rotateX(Math.PI / 2); // face the camera, pointy-top

    const dustPts = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      dustPts[i * 3] = (Math.random() - 0.5) * 20;
      dustPts[i * 3 + 1] = (Math.random() - 0.5) * 12;
      dustPts[i * 3 + 2] = -8 + Math.random() * 12;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPts, 3));

    return {
      core: coreGeo,
      coreEdges: new THREE.EdgesGeometry(coreGeo),
      axes: new THREE.BufferGeometry().setFromPoints(
        [[-R, 0, 0], [R, 0, 0], [0, -R, 0], [0, R, 0], [0, 0, -R], [0, 0, R]].map(
          ([x, y, z]) => new THREE.Vector3(x, y, z),
        ),
      ),
      hex,
      hexEdges: new THREE.EdgesGeometry(hex),
      head: new THREE.SphereGeometry(0.065, 16, 16),
      body: new THREE.SphereGeometry(0.13, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      ring: circle(ORBIT_RADIUS * 1.08),
      spokes: dynamicSegments(NODE_COUNT),
      chain: dynamicSegments(NODE_COUNT),
      dust: dustGeo,
    };
  }, []);

  const mat = useMemo(() => {
    const glass = (opacity: number, emissiveIntensity: number) =>
      new THREE.MeshPhysicalMaterial({
        color: '#d6efe5',
        roughness: 0.22, // frosted acrylic
        metalness: 0,
        ior: 1.45,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
        flatShading: true,
        emissive: new THREE.Color(EMERALD),
        emissiveIntensity,
      });
    const line = (opacity: number) =>
      new THREE.LineBasicMaterial({ color: EMERALD, transparent: true, opacity });
    return {
      coreGlass: glass(0.4, 0.2),
      nodeGlass: glass(0.32, 0.12),
      edge: line(0.9),
      spokes: line(0.7),
      chain: line(0.45),
      orbit: line(0.2),
      inner: new THREE.MeshBasicMaterial({
        color: EMERALD,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      icon: new THREE.MeshBasicMaterial({ color: '#6EE7B7' }),
      dust: new THREE.PointsMaterial({
        color: EMERALD,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        map: glowTex,
        blending: THREE.AdditiveBlending,
      }),
    };
  }, []);

  // Tiny procedural environment so the glass has something to reflect (no imports, no network).
  useEffect(() => {
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color('#050505');
    const disposables: { dispose(): void }[] = [];
    const panel = (w: number, h: number, pos: [number, number, number], color: string, k: number) => {
      const g = new THREE.PlaneGeometry(w, h);
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...pos);
      mesh.lookAt(0, 0, 0);
      envScene.add(mesh);
      disposables.push(g, m);
    };
    panel(10, 2, [0, 6, 1], '#eaf4ff', 3); // cool top light
    panel(4, 8, [-6, 0, 2], EMERALD, 2.5); // emerald side light
    panel(3, 6, [6, 2, -3], '#cfe9df', 1.2);

    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(envScene, 0.04);
    scene.environment = rt.texture;
    if ('environmentIntensity' in scene) scene.environmentIntensity = 0.6;
    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
      disposables.forEach((d) => d.dispose());
    };
  }, [gl, scene]);

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mat).forEach((m) => m.dispose());
      glowTex.dispose();
    },
    [geo, mat, glowTex],
  );

  useFrame((state, delta) => {
    const { clock, camera, viewport, size } = state;
    const s = input.current;
    const q = st.current;
    if (!s || !root.current || !tilt.current || !core.current) return;

    const { damp, lerp, clamp } = THREE.MathUtils;
    const t = clock.elapsedTime;
    const calm = s.reduced ? 0 : 1; // prefers-reduced-motion

    q.p = damp(q.p, s.scroll, 3.5, delta);
    q.x = damp(q.x, s.x * calm, 4, delta);
    q.y = damp(q.y, s.y * calm, 4, delta);
    const e = q.p * q.p * (3 - 2 * q.p); // eased scroll progress: 0 = hero, 1 = rail
    const coreS = 1 - e;

    /* Responsive placement: right of the hero copy on desktop, centered on narrow screens */
    const narrow = viewport.width < viewport.height * 1.15;
    const sc = narrow ? 0.62 : clamp(viewport.width / 12, 0.62, 1);
    root.current.position.x = lerp(narrow ? 0 : viewport.width * 0.2, 0, e);
    root.current.scale.setScalar(sc);

    /* Idle breathing + cursor tilt (±15°), fading out as the shape deconstructs, PLUS manual rotation */
    tilt.current.rotation.x = Math.sin(t * 0.35) * IDLE_AMPLITUDE * calm - q.y * MAX_TILT * (1 - e) + s.dragRotX;
    tilt.current.rotation.y = Math.sin(t * 0.27) * IDLE_AMPLITUDE * calm + q.x * MAX_TILT * (1 - e) + s.dragRotY;

    /* Raycast from the cursor through the scene */
    tmp.ray.setFromCamera(tmp.ndc.set(s.x, s.y), camera);
    let hit = -1;
    let best = HOVER_RADIUS * sc;
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes.current[i];
      if (!n) continue;
      n.getWorldPosition(tmp.w);
      const d = s.active ? tmp.ray.ray.distanceToPoint(tmp.w) : Infinity;
      q.dist[i] = d;
      if (d < best) {
        best = d;
        hit = i;
      }
    }
    
    // Allow rotating by clicking even if not hovering a node
    // Let's set it so hoveredNode is always valid (we can just click anywhere to rotate since it's a 3D bg)
    // Wait, the user specifically asked "click and hold the mouse on ANY OF THE NODES"
    s.hoveredNode = hit;

    /* Nodes: orbit ⇄ horizontal rail, pulled toward the screen near the cursor */
    const rowHalf = (viewport.width * 0.44) / sc;
    const rowY = (viewport.height * ROW_Y) / sc;
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes.current[i];
      if (!n) continue;
      const isHit = i === hit ? 1 : 0;
      q.hover[i] = damp(q.hover[i], isHit, 8, delta);
      const near = clamp(1 - q.dist[i] / (1.8 * sc), 0, 1);
      q.lift[i] = damp(q.lift[i], (near * 0.7 + isHit * 0.3) * (1 - 0.6 * e) * calm, 6, delta);

      const o = ORBIT[i];
      const rowX = ((i - (NODE_COUNT - 1) / 2) / ((NODE_COUNT - 1) / 2)) * rowHalf;
      n.position.set(lerp(o.x, rowX, e), lerp(o.y, rowY, e), lerp(o.z, 0, e) + q.lift[i]);
      n.scale.setScalar(lerp(1, 0.78, e) + q.hover[i] * 0.28);

      const halo = halos.current[i];
      if (halo) (halo.material as THREE.SpriteMaterial).opacity = 0.14 + q.hover[i] * 0.8;
    }

    /* Connectors: core→node spokes and node→node chain, trimmed at the node edges */
    const sp = geo.spokes.attributes.position.array as Float32Array;
    const ch = geo.chain.attributes.position.array as Float32Array;
    const trim = NODE_RADIUS * 0.9;
    for (let i = 0; i < NODE_COUNT; i++) {
      const p = nodes.current[i]!.position;
      const pn = nodes.current[(i + 1) % NODE_COUNT]!.position;

      tmp.a.copy(DIRS[i]).multiplyScalar(REACH[i] * coreS);
      tmp.b.copy(p).sub(tmp.a).setLength(trim);
      sp.set([tmp.a.x, tmp.a.y, tmp.a.z, p.x - tmp.b.x, p.y - tmp.b.y, p.z - tmp.b.z], i * 6);

      tmp.c.copy(pn).sub(p).setLength(trim);
      ch.set(
        [p.x + tmp.c.x, p.y + tmp.c.y, p.z + tmp.c.z, pn.x - tmp.c.x, pn.y - tmp.c.y, pn.z - tmp.c.z],
        i * 6,
      );
    }
    geo.spokes.attributes.position.needsUpdate = true;
    geo.chain.attributes.position.needsUpdate = true;
    mat.spokes.opacity = 0.7 * coreS;
    mat.chain.opacity = lerp(0.45, 0.85, e);
    mat.orbit.opacity = 0.2 * coreS;

    /* Core: emerald pulse, dissolves on scroll */
    const pulse = Math.pow(0.5 + 0.5 * Math.sin(t * 1.1), 3) * calm;
    core.current.scale.setScalar(Math.max(coreS, 0.0001));
    core.current.visible = coreS > 0.01;
    mat.coreGlass.emissiveIntensity = 0.18 + 0.5 * pulse;
    if (glow.current) (glow.current.material as THREE.SpriteMaterial).opacity = (0.28 + 0.4 * pulse) * coreS;
    if (coreLight.current) coreLight.current.intensity = (6 + 12 * pulse) * coreS;

    /* Depth-layer dust drifts opposite to the cursor */
    if (dust.current) {
      dust.current.rotation.y = t * 0.012 * calm;
      dust.current.position.set(-q.x * 0.5, -q.y * 0.3, 0);
    }

    /* Ease the whole scene back once it becomes a rail behind content */
    gl.domElement.style.opacity = String(lerp(1, 0.6, e));

    /* Micro-label for the hovered node (DOM overlay, no React re-render) */
    const el = labelRef.current;
    if (el) {
      if (hit !== q.label) {
        q.label = hit;
        if (hit >= 0) el.textContent = labels[hit % labels.length] ?? `Member ${hit + 1}`;
        el.style.opacity = hit >= 0 ? '1' : '0';
      }
      if (hit >= 0) {
        nodes.current[hit]!.getWorldPosition(tmp.w).project(camera);
        const x = (tmp.w.x * 0.5 + 0.5) * size.width;
        const y = (-tmp.w.y * 0.5 + 0.5) * size.height;
        const off = Math.round(NODE_RADIUS * sc * 1.3 * (size.height / viewport.height) + 8);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, calc(-100% - ${off}px))`;
      }
    }
  });

  return (
    <>
      <fog attach="fog" args={['#0a0a0a', 12, 30]} />

      {/* Lighting: cool white rim on the top edges + emerald accent + inner emerald glow */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[2, 6, 3]} intensity={2.2} color="#eaf4ff" />
      <directionalLight position={[-4, -1, 3]} intensity={2.4} color={EMERALD} />

      <group ref={root}>
        <group ref={tilt}>
          {/* Faceted glass core */}
          <group ref={core}>
            <mesh geometry={geo.core} material={mat.coreGlass} />
            <mesh geometry={geo.core} material={mat.inner} scale={0.5} />
            <lineSegments geometry={geo.coreEdges} material={mat.edge} />
            <lineSegments geometry={geo.axes} material={mat.edge} />
            <sprite ref={glow} scale={[7, 7, 1]}>
              <spriteMaterial
                map={glowTex}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.4}
              />
            </sprite>
            <pointLight ref={coreLight} color={EMERALD} distance={9} decay={2} intensity={10} />
          </group>

          {/* Connectors */}
          <lineSegments geometry={geo.spokes} material={mat.spokes} frustumCulled={false} />
          <lineSegments geometry={geo.chain} material={mat.chain} frustumCulled={false} />
          <lineLoop geometry={geo.ring} material={mat.orbit} />
          <lineLoop geometry={geo.ring} material={mat.orbit} rotation={[1.1, 0.5, 0]} />

          {/* The 8 team nodes */}
          {ORBIT.map((pos, i) => (
            <group
              key={i}
              position={pos}
              ref={(el: THREE.Group | null) => {
                nodes.current[i] = el;
              }}
            >
              <mesh geometry={geo.hex} material={mat.nodeGlass} />
              <lineSegments geometry={geo.hexEdges} material={mat.edge} />
              <group position={[0, 0, 0.05]} scale={[1, 1, 0.5]}>
                <mesh geometry={geo.head} material={mat.icon} position={[0, 0.075, 0]} />
                <mesh geometry={geo.body} material={mat.icon} position={[0, -0.14, 0]} />
              </group>
              <sprite
                position={[0, 0, -0.1]}
                scale={[2.4, 2.4, 1]}
                ref={(el: THREE.Sprite | null) => {
                  halos.current[i] = el;
                }}
              >
                <spriteMaterial
                  map={glowTex}
                  transparent
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  opacity={0.14}
                />
              </sprite>
            </group>
          ))}
        </group>
      </group>

      {/* Drifting particles */}
      <group ref={dust}>
        <points geometry={geo.dust} material={mat.dust} />
      </group>

      {/* Faint floor grid that fades into the fog */}
      <gridHelper
        args={[60, 60, EMERALD, EMERALD]}
        position={[0, -3.8, -8]}
        material-transparent
        material-opacity={0.1}
      />
    </>
  );
}
