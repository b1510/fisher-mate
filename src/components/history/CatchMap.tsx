import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { defaultMarkerIcon } from '@/lib/leafletIcon'
import type { HistoryItem } from '@/lib/historyItem'

interface CatchMapProps {
  catches: HistoryItem[]
}

const DEFAULT_CENTER: [number, number] = [46.6, 2.4]

export function CatchMap({ catches }: CatchMapProps) {
  const validCatches = catches.filter(
    (c) => Number.isFinite(c.latitude) && Number.isFinite(c.longitude),
  )
  const center: [number, number] =
    validCatches.length > 0 ? [validCatches[0].latitude, validCatches[0].longitude] : DEFAULT_CENTER

  return (
    <div className="h-[70vh] rounded-md overflow-hidden">
      <MapContainer center={center} zoom={validCatches.length > 0 ? 8 : 5} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validCatches.map((c) => (
          <Marker key={c.key} position={[c.latitude, c.longitude]} icon={defaultMarkerIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{c.species ?? 'Espèce inconnue'}</div>
                <div>{new Date(c.capturedAt).toLocaleString('fr-FR')}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
