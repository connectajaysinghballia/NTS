"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import createGlobe from "cobe"
import { useSpring } from "@react-spring/web"

// Spherical linear interpolation between two lat/lon points
const interpolateLatLong = (start: [number, number], end: [number, number], t: number) => {
  const lat1 = (start[0] * Math.PI) / 180
  const lon1 = (start[1] * Math.PI) / 180
  const lat2 = (end[0] * Math.PI) / 180
  const lon2 = (end[1] * Math.PI) / 180

  const x1 = Math.cos(lat1) * Math.cos(lon1)
  const y1 = Math.cos(lat1) * Math.sin(lon1)
  const z1 = Math.sin(lat1)

  const x2 = Math.cos(lat2) * Math.cos(lon2)
  const y2 = Math.cos(lat2) * Math.sin(lon2)
  const z2 = Math.sin(lat2)

  const dot = Math.max(-1, Math.min(1, x1 * x2 + y1 * y2 + z1 * z2))
  const omega = Math.acos(dot)

  if (omega === 0) return start

  const sinOmega = Math.sin(omega)
  const a = Math.sin((1 - t) * omega) / sinOmega
  const b = Math.sin(t * omega) / sinOmega

  const x = a * x1 + b * x2
  const y = a * y1 + b * y2
  const z = a * z1 + b * z2

  const lat = (Math.asin(z) * 180) / Math.PI
  const lon = (Math.atan2(y, x) * 180) / Math.PI

  return [lat, lon] as [number, number]
}

import { cn } from "@/lib/utils"

type CobeVariant =
  | "default"
  | "draggable"
  | "auto-draggable"
  | "auto-rotation"
  | "rotate-to-location"
  | "scaled"

interface Location {
  name: string
  lat?: number
  long?: number
  emoji?: string
}

interface GeocodeResult {
  lat: number
  lng: number
  display_name: string
}

interface CobeProps {
  variant?: CobeVariant
  className?: string
  style?: React.CSSProperties
  locations?: Location[]
  // Globe configuration settings
  phi?: number
  theta?: number
  mapSamples?: number
  mapBrightness?: number
  mapBaseBrightness?: number
  diffuse?: number
  dark?: number
  baseColor?: string
  markerColor?: string
  markerSize?: number
  glowColor?: string
  scale?: number
  offsetX?: number
  offsetY?: number
  opacity?: number
  arcs?: { location: [number, number]; target: [number, number]; color?: [number, number, number] }[]
}

type CobeState = Record<string, unknown>

export function Cobe({
  variant = "default",
  className,
  style,
  locations = [
    { name: "San Francisco", emoji: "📍" },
    { name: "Berlin", emoji: "📍" },
    { name: "Tokyo", emoji: "📍" },
    { name: "Buenos Aires", emoji: "📍" },
  ],
  // Default values based on the original JSX version
  phi = 0,
  theta = 0.2,
  mapSamples = 16000,
  mapBrightness = 1.8,
  mapBaseBrightness = 0.05,
  diffuse = 3,
  dark = 1.0,
  baseColor = "#ffffff",
  markerColor = "#fb6415",
  markerSize = 0.05,
  glowColor = "#ffffff",
  scale = 1.0,
  offsetX = 0.0,
  offsetY = 0.0,
  opacity = 0.7,
  arcs = [],
}: CobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef<number>(0)
  const focusRef = useRef<[number, number]>([0, 0])
  const [customLocations, setCustomLocations] = useState<Location[]>([])
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const labelsRef = useRef<HTMLDivElement>(null)

  // Label data for specific locations
  const markerLabels = [
    { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 }
  ]

  useEffect(() => {
    console.log("Globe component mounted on variant:", variant)
  }, [variant])

  const [{ r }, api] = useSpring<{ r: number }>(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }))

  const locationToAngles = (lat: number, long: number): [number, number] => {
    return [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180,
    ] as [number, number]
  }

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
      : [0, 0, 0]
  }

  const geocodeLocation = async (
    query: string
  ): Promise<GeocodeResult | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          headers: {
            'User-Agent': 'NTS-Site-Globe-Component'
          }
        }
      )

      if (!response.ok) throw new Error("Geocoding service unavailable")

      const data = await response.json()

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display_name: data[0].display_name,
        }
      }
      return null
    } catch (error) {
      console.warn("Geocoding info:", error)
      return null
    }
  }

  const geocodeLocationList = useCallback(async (locationList: Location[]) => {
    const geocodedLocations: Location[] = []

    for (const location of locationList) {
      if (location.lat && location.long) {
        // Already has coordinates
        geocodedLocations.push(location)
      } else {
        // Need to geocode
        const result = await geocodeLocation(location.name)
        if (result) {
          geocodedLocations.push({
            ...location,
            lat: result.lat,
            long: result.lng,
          })
        }
      }
    }

    return geocodedLocations
  }, [])

  // Initialize locations on component mount
  useEffect(() => {
    const initializeLocations = async () => {
      if (variant === "rotate-to-location" && locations.length > 0) {
        setIsInitializing(true)
        try {
          const geocoded = await geocodeLocationList(locations)
          setCustomLocations(geocoded)
        } catch (e) {
          console.error("Failed to initialize locations", e)
        } finally {
          setIsInitializing(false)
        }
      }
    }

    initializeLocations()
  }, [variant, locations, geocodeLocationList])

  useEffect(() => {
    let phiVal = phi
    let width = 0
    let currentPhi = 0
    let currentTheta = 0
    const doublePi = Math.PI * 2

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    if (!canvasRef.current) return

    let globe: { destroy: () => void } | null = null

    const baseMarkers = variant === "default" ||
      variant === "draggable" ||
      variant === "auto-draggable" ||
      variant === "auto-rotation" ||
      variant === "scaled"
      ? [
        { location: [-33.8688, 151.2093] as [number, number], size: markerSize * 1.5, color: [0, 0.7, 1] as [number, number, number] },
        { location: [26.4499, 80.3319] as [number, number], size: markerSize * 1.5, color: [0, 0.7, 1] as [number, number, number] },
        { location: [37.7595, -122.4367] as [number, number], size: markerSize },
        { location: [40.7128, -74.006] as [number, number], size: markerSize },
      ]
      : variant === "rotate-to-location"
        ? customLocations
          .filter((loc) => loc.lat && loc.long)
          .map((loc) => ({
            location: [loc.lat!, loc.long!] as [number, number],
            size: markerSize,
          }))
        : []

    // Static markers to form the visible line (keeping it under the 64 marker limit)
    const lineMarkers: any[] = [];
    if (arcs && arcs.length > 0) {
      for (const arc of arcs) {
        for (let i = 0; i <= 20; i++) {
          lineMarkers.push({
            location: interpolateLatLong(arc.location, arc.target, i / 20),
            size: markerSize * 0.3,
            color: arc.color || [0, 0.5, 0.8],
          });
        }
      }
    }
    const allBaseMarkers = [...baseMarkers, ...lineMarkers];

    try {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: width * 2,
        height: variant === "scaled" ? width * 2 * 0.4 : width * 2,
        phi: phiVal,
        theta: theta,
        dark: dark,
        diffuse: diffuse,
        mapSamples: mapSamples,
        mapBrightness: mapBrightness,
        mapBaseBrightness: mapBaseBrightness,
        baseColor: hexToRgb(baseColor),
        markerColor: hexToRgb(markerColor),
        glowColor: hexToRgb(glowColor),
        markers: allBaseMarkers,
        // @ts-ignore
        arcs: arcs,
        scale: scale || (variant === "scaled" ? 2.5 : 1),
        offset: variant === "scaled" ? [0, width * 2 * 0.4 * 0.6] : undefined,
        opacity: opacity,
        onRender: (state: CobeState) => {
          switch (variant) {
            case "default":
              state.phi = phiVal + r.get()
              phiVal += 0.005
              break
            case "draggable":
              state.phi = r.get()
              break
            case "auto-draggable":
              if (!pointerInteracting.current) {
                phiVal += 0.005
              }
              state.phi = phiVal + r.get()
              break
            case "auto-rotation":
              state.phi = phiVal
              phiVal += 0.005
              break
            case "rotate-to-location":
              state.phi = currentPhi
              state.theta = currentTheta
              const [focusPhi, focusTheta] = focusRef.current
              const distPositive = (focusPhi - currentPhi + doublePi) % doublePi
              const distNegative = (currentPhi - focusPhi + doublePi) % doublePi
              if (distPositive < distNegative) {
                currentPhi += distPositive * 0.08
              } else {
                currentPhi -= distNegative * 0.08
              }
              currentTheta = currentTheta * 0.92 + focusTheta * 0.08
              break
            case "scaled":
              // No rotation for scaled variant
              break
          }

          state.width = width * 2
          state.height = variant === "scaled" ? width * 2 * 0.4 : width * 2

          // Update label positions
          if (labelsRef.current) {
            const labels = labelsRef.current.children
            const currentPhi = state.phi as number
            const currentTheta = state.theta as number

            markerLabels.forEach((label, i) => {
              const el = labels[i] as HTMLElement
              if (!el) return

              // Convert lat/lon to 3D Cartesian coordinates
              const latRad = (label.lat * Math.PI) / 180
              // Adjust longitude by phi (y-axis rotation in cobe)
              // cobe's phi is negative of longitude rotation typically
              const lonRad = (label.lon * Math.PI) / 180 + currentPhi + Math.PI / 2

              const x = Math.cos(latRad) * Math.sin(lonRad)
              const y = Math.sin(latRad) * Math.cos(currentTheta) - Math.cos(latRad) * Math.cos(lonRad) * Math.sin(currentTheta)
              const z = Math.cos(latRad) * Math.cos(lonRad) * Math.cos(currentTheta) + Math.sin(latRad) * Math.sin(currentTheta)

              // Project to screen
              // Globe radius in screen pixels is roughly half of container width
              const screenX = (x * width * 0.4) + (width / 2)
              const screenY = (-y * width * 0.4) + (width / 2)

              // Only show if it's on the front half (z > 0)
              if (z > 0.05) {
                el.style.opacity = "1"
                el.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -100%) translateY(-10px)`
              } else {
                el.style.opacity = "0"
              }
            })
          }

          if (arcs && arcs.length > 0) {
            const t = (Date.now() % 3000) / 3000 
            const animatedMarkers = []
            for (const arc of arcs) {
              const progress = t * 1.4 // Wrap around feel
              if (progress >= 0 && progress <= 1) {
                // Comet Head
                animatedMarkers.push({
                  location: interpolateLatLong(arc.location, arc.target, progress),
                  size: markerSize * 1.4,
                  color: [1, 1, 1] as [number, number, number],
                })
                // Tail
                for (let i = 1; i < 5; i++) {
                   const trailT = Math.max(0, progress - i * 0.03)
                   animatedMarkers.push({
                     location: interpolateLatLong(arc.location, arc.target, trailT),
                     size: markerSize * (1.2 - i * 0.2),
                     color: arc.color || [0, 0.7, 1] as [number, number, number],
                   })
                }
              }
            }
            state.markers = [...allBaseMarkers, ...animatedMarkers]
          } else {
            state.markers = allBaseMarkers
          }
        },
      } as any)
    } catch (e) {
      console.error("Cobe Globe initialization error:", e)
      setError("WebGL initialization failed. Please ensure your browser supports WebGL.")
    }

    if (canvasRef.current) {
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = opacity.toString()
        }
      })
    }

    return () => {
      if (globe) globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [
    variant,
    r,
    customLocations,
    phi,
    theta,
    mapSamples,
    mapBrightness,
    mapBaseBrightness,
    diffuse,
    dark,
    baseColor,
    markerColor,
    markerSize,
    glowColor,
    scale,
    offsetX,
    offsetY,
    opacity,
    arcs,
  ])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (
      variant === "draggable" ||
      variant === "auto-draggable" ||
      variant === "default"
    ) {
      pointerInteracting.current =
        e.clientX - pointerInteractionMovement.current
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    }
  }

  const handlePointerUp = () => {
    if (
      variant === "draggable" ||
      variant === "auto-draggable" ||
      variant === "default"
    ) {
      pointerInteracting.current = null
      if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    }
  }

  const handlePointerOut = () => {
    if (
      variant === "draggable" ||
      variant === "auto-draggable" ||
      variant === "default"
    ) {
      pointerInteracting.current = null
      if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (
      (variant === "draggable" ||
        variant === "auto-draggable" ||
        variant === "default") &&
      pointerInteracting.current !== null
    ) {
      const delta = e.clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      api.start({
        r: delta / 200,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (
      (variant === "draggable" ||
        variant === "auto-draggable" ||
        variant === "default") &&
      pointerInteracting.current !== null &&
      e.touches[0]
    ) {
      const delta = e.touches[0].clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      api.start({
        r: delta / 100,
      })
    }
  }

  const handleLocationClick = (lat: number, long: number) => {
    if (variant === "rotate-to-location") {
      focusRef.current = locationToAngles(lat, long)
    }
  }

  const containerStyle = {
    width: "100%",
    maxWidth: variant === "scaled" ? 800 : 600,
    aspectRatio: variant === "scaled" ? 2.5 : 1,
    margin: "auto",
    position: "relative" as const,
    ...style,
  }

  const canvasStyle = {
    width: "100%",
    height: "100%",
    contain: "layout paint size" as const,
    opacity: 0,
    transition: "opacity 0.4s ease",
    cursor:
      variant === "draggable" ||
        variant === "auto-draggable" ||
        variant === "default"
        ? "grab"
        : undefined,
    borderRadius:
      variant === "default" ||
        variant === "draggable" ||
        variant === "auto-draggable" ||
        variant === "auto-rotation"
        ? "50%"
        : variant === "scaled"
          ? "8px"
          : undefined,
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 text-sm p-4 text-center", className)} style={containerStyle}>
        {error}
      </div>
    )
  }

  return (
    <div className={cn("", className)} style={containerStyle}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={canvasStyle}
      />
      <div 
        ref={labelsRef} 
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      >
        {markerLabels.map((label, i) => (
          <div 
            key={i} 
            className="absolute left-0 top-0 whitespace-nowrap opacity-0 transition-opacity duration-300"
          >
            <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-2xl flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#00b4d8] rounded-full animate-pulse shadow-[0_0_8px_#00b4d8]"></span>
              {label.name}
            </div>
          </div>
        ))}
      </div>
      {variant === "rotate-to-location" && (
        <div
          className="control-buttons flex flex-col items-center justify-center md:flex-row"
          style={{ gap: ".5rem" }}
        >
          {isInitializing ? "Loading locations..." : ""}
          {customLocations
            .filter((loc) => loc.lat && loc.long)
            .map((location, index) => (
              <button
                key={index}
                onClick={() =>
                  handleLocationClick(location.lat!, location.long!)
                }
                className="bg-background/80 text-foreground hover:bg-background/90 border border-border px-4 py-2 rounded-md transition-all duration-200 hover:scale-105"
              >
                {location.emoji || "📍"} {location.name}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
