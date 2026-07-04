import { useMemo, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import type { Marker as LeafletMarker, LeafletMouseEvent } from 'leaflet'
import { defaultMarkerIcon } from '@/lib/leafletIcon'

interface LocationFallbackProps {
  latitude: number | null
  longitude: number | null
  onChange: (lat: number, lng: number) => void
}

const DEFAULT_CENTER: [number, number] = [46.6, 2.4]

function ClickHandler({ onClick }: { onClick: (e: LeafletMouseEvent) => void }) {
  useMapEvents({ click: onClick })
  return null
}

export function LocationFallback({ latitude, longitude, onChange }: LocationFallbackProps) {
  const markerRef = useRef<LeafletMarker | null>(null)
  const hasPosition = latitude !== null && longitude !== null
  const position: [number, number] = useMemo(
    () => (hasPosition ? [latitude, longitude] : DEFAULT_CENTER),
    [hasPosition, latitude, longitude],
  )

  return (
    <div className="h-64 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700">
      <MapContainer center={position} zoom={hasPosition ? 11 : 5} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onClick={(e) => onChange(e.latlng.lat, e.latlng.lng)} />
        {hasPosition && (
          <Marker
            position={position}
            icon={defaultMarkerIcon}
            draggable
            ref={markerRef}
            eventHandlers={{
              dragend: () => {
                const marker = markerRef.current
                if (marker) {
                  const { lat, lng } = marker.getLatLng()
                  onChange(lat, lng)
                }
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
