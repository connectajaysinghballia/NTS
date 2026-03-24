"use client"

import React, { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const GlobeGL = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-white/20">Loading Globe...</div>
});

interface LabelData {
  name: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

export function ProperGlobe({ className }: { className?: string }) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 450, height: 450 });

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth || 450, height: clientHeight || 450 });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize(); // Initial call
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const arcsData = useMemo(() => [
    { startLat: 26.4499, startLng: 80.3319, endLat: -33.8688, endLng: 151.2093, color: ['#00b4d8', '#ffffff'] },
    { startLat: -33.8688, startLng: 151.2093, endLat: 37.7595, endLng: -122.4367, color: ['#00b4d8', '#ffffff'] }
  ], []);

  const labelsData = useMemo(() => [
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319, size: 0.8, color: 'white' },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, size: 0.8, color: 'white' },
    { name: 'San Francisco', lat: 37.7595, lng: -122.4367, size: 0.8, color: 'white' }
  ], []);

  useEffect(() => {
    if (globeRef.current && mounted) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;
        controls.enablePan = false;
        controls.enableZoom = false; // Keep it clean for hero section
      }
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className={cn("pointer-events-auto", className)}>
      <GlobeGL
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        labelsData={labelsData}
        labelText="name"
        labelSize="size"
        labelDotRadius={0.3}
        labelColor={(label: any) => label.color}
        labelResolution={2}
        enablePointerInteraction={true}
        waitForGlobeReady={true}
      />
    </div>
  );
}
