"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import DottedMap from 'dotted-map';
import proj4 from 'proj4';

// proj4 is needed by dotted-map at runtime/bundle time
// We import it here to ensure it's available in the bundle.
const _p = proj4;

interface GlobeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  autoRotateSpeed?: number;
  connections?: { from: [number, number]; to: [number, number] }[];
  markers?: { lat: number; lng: number; label?: string }[];
}

function latLngToXYZ(
  lat: number,
  lng: number,
  radius: number
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function rotateY(
  x: number,
  y: number,
  z: number,
  angle: number
): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos];
}

function rotateX(
  x: number,
  y: number,
  z: number,
  angle: number
): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

function project(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  fov: number
): [number, number, number] {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z];
}

export function InteractiveGlobe({
  className,
  size = 600,
  dotColor = "rgba(0, 180, 216, ALPHA)", 
  arcColor = "rgba(144, 224, 239, 0.4)", 
  markerColor = "rgba(255, 255, 255, 1)", 
  autoRotateSpeed = 0.003,
  connections = [
    { from: [26.4499, 80.3319], to: [-33.8688, 151.2093] }, 
    { from: [-33.8688, 151.2093], to: [37.7595, -122.4367] }, 
  ],
  markers = [
    { lat: 26.4499, lng: 80.3319, label: "Kanpur" },
    { lat: -33.8688, lng: 151.2093, label: "Sydney" },
    { lat: 37.7595, lng: -122.4367, label: "San Francisco" }
  ],
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef = useRef(2.4); // Focus on India/Australia initially
  const rotXRef = useRef(0.2);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startRotY: number;
    startRotX: number;
  }>({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Generate globe dots (land approximation via DottedMap)
  const dotsRef = useRef<[number, number, number][]>([]);

  useEffect(() => {
     const map = new DottedMap({ height: 60, grid: 'vertical' });
     const points = map.getPoints();
     dotsRef.current = points.map(p => {
        // Project 2D map points onto sphere normalized coordinates [-1, 1]
        const phi = ((90 - p.lat) * Math.PI) / 180;
        const theta = ((p.lng + 180) * Math.PI) / 180;
        return [
           Math.sin(phi) * Math.cos(theta),
           Math.cos(phi),
           Math.sin(phi) * Math.sin(theta)
        ] as [number, number, number];
     });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    
    if (w < 1 || h < 1) {
       animRef.current = requestAnimationFrame(draw);
       return;
    }

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.42;
    const fov = 800;

    // Helper to handle color opacity
    const getRGBA = (color: string, opacity: number) => {
       if (color.startsWith('rgba')) {
          return color.replace(/[\d.]+\)$/g, `${opacity})`);
       }
       if (color.startsWith('#')) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
       }
       return color;
    };

    // Auto rotate
    if (!dragRef.current.active) {
      rotYRef.current += autoRotateSpeed;
    }

    timeRef.current += 0.012;
    const time = timeRef.current;

    ctx.clearRect(0, 0, w, h);

    // Inner glow (to match Cobe's spherical feel)
    const radialGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.1);
    radialGlow.addColorStop(0, "rgba(0, 180, 216, 0.05)");
    radialGlow.addColorStop(0.5, "rgba(0, 180, 216, 0.02)");
    radialGlow.addColorStop(1, "rgba(0, 180, 216, 0)");
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
    ctx.fill();

    const ry = rotYRef.current;
    const rx = rotXRef.current;

    // Draw dots
    const dots = dotsRef.current;
    for (let i = 0; i < dots.length; i++) {
      let [x, y, z] = dots[i];
      x *= radius;
      y *= radius;
      z *= radius;

      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);

      // Sparser back-facing dots (keep some for transparency effect)
      if (z > 0 && i % 3 !== 0) continue; 

      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const depthAlpha = Math.max(0.05, 0.8 - (z + radius) / (2 * radius));
      const dotSize = z < 0 ? 1.2 : 0.8;

      ctx.beginPath();
      ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(dotColor, z < 0 ? depthAlpha : depthAlpha * 0.3);
      ctx.fill();
    }

    // Draw connections as arcs
    for (const conn of connections) {
      const [lat1, lng1] = conn.from;
      const [lat2, lng2] = conn.to;

      let [x1, y1, z1] = latLngToXYZ(lat1, lng1, radius);
      let [x2, y2, z2] = latLngToXYZ(lat2, lng2, radius);

      [x1, y1, z1] = rotateX(x1, y1, z1, rx);
      [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx);
      [x2, y2, z2] = rotateY(x2, y2, z2, ry);

      // Only draw if both points face camera
      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;

      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

      // Elevated midpoint for arc
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const midZ = (z1 + z2) / 2;
      const midLen = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
      const arcHeight = radius * 1.25;
      const elevX = (midX / midLen) * arcHeight;
      const elevY = (midY / midLen) * arcHeight;
      const elevZ = (midZ / midLen) * arcHeight;
      const [scx, scy] = project(elevX, elevY, elevZ, cx, cy, fov);

      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Traveling dot along arc
      const t = (Math.sin(time * 1.2 + lat1 * 0.1) + 1) / 2;
      const tx = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
      const ty = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;

      ctx.beginPath();
      ctx.arc(tx, ty, 2, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.fill();
    }

    // Draw markers
    for (const marker of markers) {
      let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);

      if (z > radius * 0.1) continue;

      const [sx, sy] = project(x, y, z, cx, cy, fov);

      // Pulse ring
      const pulse = Math.sin(time * 2 + marker.lat) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 4 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(markerColor, 0.2 + pulse * 0.15);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(markerColor, 1);
      ctx.fill();

      // Label
      if (marker.label) {
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillStyle = getRGBA(markerColor, 0.6);
        ctx.fillText(marker.label, sx + 8, sy + 3);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [dotColor, arcColor, markerColor, autoRotateSpeed, connections, markers]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // Mouse drag handlers
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startRotY: rotYRef.current,
        startRotX: rotXRef.current,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      rotYRef.current = dragRef.current.startRotY + dx * 0.005;
      rotXRef.current = Math.max(
        -1,
        Math.min(1, dragRef.current.startRotX + dy * 0.005)
      );
    },
    []
  );

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full cursor-grab active:cursor-grabbing", className)}
      style={{ width: size, height: size }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}
