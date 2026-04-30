import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

interface OsmMapPickerProps {
  value: { lat: number; lng: number } | null
  onChange: (value: { lat: number; lng: number } | null) => void
  onAddressChange: (address: string | null) => void
}

const defaultCenter = { lat: 30.0131, lng: 31.4089 }

const iconFixApplied = (() => {
  let applied = false
  return () => {
    if (applied) return
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow
    })
    applied = true
  }
})()

function MapClickHandler({
  onChange,
  onAddressChange
}: {
  onChange: (value: { lat: number; lng: number }) => void
  onAddressChange: (address: string | null) => void
}) {
  useMapEvents({
    click(event) {
      onAddressChange(null)
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng })
    }
  })

  return null
}

function MapViewUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center)
  }, [center, map])

  return null
}

/**
 * OsmMapPicker - OSM-backed location picker for employer profiles.
 *
 * @param value - The current location selection.
 * @param onChange - Callback fired with the clicked coordinates.
 * @param onAddressChange - Callback fired when the address should be refreshed.
 */
export default function OsmMapPicker({ value, onChange, onAddressChange }: OsmMapPickerProps): React.JSX.Element {
  const [tileError, setTileError] = useState(false)
  const center = useMemo(() => value ?? defaultCenter, [value])

  useEffect(() => {
    iconFixApplied()
  }, [])

  return (
    <div className="space-y-2">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="w-full min-h-80 rounded-xl border border-outline-variant/40"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileerror: () => setTileError(true)
          }}
        />
        <MapViewUpdater center={center} />
        <MapClickHandler onChange={onChange} onAddressChange={onAddressChange} />
        {value && <Marker position={[value.lat, value.lng]} />}
      </MapContainer>
      {tileError && (
        <p className="font-lexend text-xs text-error">Map tiles failed to load. You can still select a location to save coordinates.</p>
      )}
    </div>
  )
}
