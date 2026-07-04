export interface GeolocationResult {
  latitude: number
  longitude: number
}

/** Requests the device's current position once. Rejects on denial, timeout, or if unsupported. */
export function requestDeviceLocation(): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("La géolocalisation n'est pas disponible sur cet appareil"))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      },
      (err) => reject(new Error(err.message)),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  })
}
