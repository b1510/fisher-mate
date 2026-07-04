import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { defaultMarkerIcon } from '@/lib/leafletIcon'
import type { HistoryItem } from '@/lib/historyItem'

interface CatchMapProps {
  catches: HistoryItem[]
}

const DEFAULT_CENTER: [number, number] = [46.6, 2.4]

export function CatchMap({ catches }: CatchMapProps) {
  const center: [number, number] =
    catches.length > 0 ? [catches[0].latitude, catches[0].longitude] : DEFAULT_CENTER

  return (
    <div className="h-[70vh] rounded-md overflow-hidden">
      <MapContainer center={center} zoom={catches.length > 0 ? 8 : 5} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {catches.map((c) => (
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
