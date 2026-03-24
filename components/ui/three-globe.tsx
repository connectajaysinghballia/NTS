"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Color } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

const cameraZ = 330;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    // Transparent background for the canvas
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig, data } = props;
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const globeInstance = useMemo(() => {
    try {
      const g = new ThreeGlobe();
      return g;
    } catch (e) {
      console.error("Globe instance creation error:", e);
      setError("Failed to initialize 3D Globe");
      return null;
    }
  }, []);

  const defaultProps = useMemo(() => {
    return {
      pointSize: globeConfig.pointSize || 4,
      globeColor: globeConfig.globeColor || "#062056",
      showAtmosphere: globeConfig.showAtmosphere !== undefined ? globeConfig.showAtmosphere : true,
      atmosphereColor: globeConfig.atmosphereColor || "#38bdf8",
      atmosphereAltitude: globeConfig.atmosphereAltitude || 0.2,
      polygonColor: globeConfig.polygonColor || "rgba(0,180,216,1.0)",
      emissive: globeConfig.emissive || "#0a2e5e",
      emissiveIntensity: 1.0,
      shininess: globeConfig.shininess || 0.9,
      arcTime: globeConfig.arcTime || 2000,
      arcLength: globeConfig.arcLength || 0.9,
    };
  }, [globeConfig]);

  useEffect(() => {
    if (globeRef.current && globeInstance) {
      _buildData();
      _buildMaterial();
    }
  }, [data, globeInstance]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    const globeMaterial = (globeRef.current as any).globeMaterial();
    globeMaterial.color = new Color("#081b33");
    globeMaterial.emissive = new Color("#0a2e5e");
    globeMaterial.emissiveIntensity = 1.2;
    globeMaterial.shininess = 0.8;
    globeMaterial.transparent = true;
    globeMaterial.opacity = 0.95;
  };

  const _buildData = () => {
    if (!globeRef.current) return;

    try {
      const arcs = data.map((d) => ({
        startLat: d.startLat,
        startLng: d.startLng,
        endLat: d.endLat,
        endLng: d.endLng,
        color: d.color,
      }));

      globeRef.current
        .showGlobe(true)
        .showAtmosphere(true)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .arcsData(arcs)
        .arcColor((e: any) => e.color)
        .arcDashLength(defaultProps.arcLength)
        .arcDashGap(2)
        .arcDashInitialGap((e: any) => (e.order || 1) * 1)
        .arcDashAnimateTime(defaultProps.arcTime)
        .arcStroke(1.5)
        .arcAltitude(0.2)
        .pointsData([
          { lat: 27.2499, lng: 79.0319, size: 2.5, color: "#ffffff" },
          { lat: -34.8688, lng: 152.2093, size: 2.5, color: "#ffffffff" }
        ])
        .pointRadius(0.8)
        .pointAltitude(0.03)
        .pointColor((e: any) => e.color)
        .labelsData([
          { lat: 27.2499, lng: 79.0319, text: "Kanpur", color: "#ffffff", size: 6 },
          { lat: -34.8688, lng: 152.2093, text: "Sydney", color: "#fafbfbff", size: 6 }
        ])
        .labelSize((e: any) => e.size || 6)
        .labelDotRadius(0.4)
        .labelAltitude(0.08)
        .labelColor((e: any) => e.color)
        .labelText((e: any) => e.text)
        .labelResolution(6);

      if (countries && countries.features) {
        globeRef.current
          .polygonsData(countries.features.filter((d: any) => d.properties.ISO_A3 !== "ATA"))
          .polygonCapColor(() => defaultProps.polygonColor)
          .polygonSideColor(() => "rgba(0, 0, 0, 0.4)")
          .polygonStrokeColor(() => "rgba(255, 255, 255, 0.2)");
      }
    } catch (e) {
      console.error("Globe data build error:", e);
      setError("Failed to load globe data");
    }
  };

  if (error) return (
    <div className="flex items-center justify-center w-full h-full text-white/50 text-xs">
      {error}
    </div>
  );
  if (!globeInstance) return null;

  return (
    <primitive object={globeInstance} ref={globeRef} />
  );
}

export function ThreeGlobeComponent({ globeConfig, data }: WorldProps) {
  return (
    <div className="w-full h-full relative" style={{ minHeight: '300px' }}>
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <WebGLRendererConfig />
        <ambientLight color="#ffffff" intensity={4.0} />
        <directionalLight
          color="#ffffff"
          position={[-400, 100, 400]}
          intensity={3.0}
        />
        <pointLight
          color="#ffffff"
          position={[200, 500, 200]}
          intensity={4.0}
        />
        <World globeConfig={globeConfig} data={data} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minDistance={cameraZ}
          maxDistance={cameraZ}
          autoRotate={globeConfig.autoRotate}
          autoRotateSpeed={globeConfig.autoRotateSpeed}
        />
      </Canvas>
    </div>
  );
}
