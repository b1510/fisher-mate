import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { Catch } from '@shared/types'

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface CatchMapProps {
  catches: Catch[]
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
          <Marker key={c.id} position={[c.latitude, c.longitude]} icon={defaultIcon}>
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
