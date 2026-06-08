// Integracao com Google Maps (abrir rota) e estimativa simples de distancia.

export function urlRota(lat?: number, lng?: number, endereco?: string): string {
  const dest = lat != null && lng != null ? `${lat},${lng}` : encodeURIComponent(endereco || "");
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
}

export function abrirRota(lat?: number, lng?: number, endereco?: string) {
  if (typeof window !== "undefined") window.open(urlRota(lat, lng, endereco), "_blank");
}

// Distancia aproximada (Haversine) em km, e tempo estimado a ~35 km/h em cidade.
export function distanciaEstimada(
  origem: { lat: number; lng: number },
  destino: { lat?: number; lng?: number }
): { km: number; minutos: number } | null {
  if (destino.lat == null || destino.lng == null) return null;
  const R = 6371;
  const dLat = ((destino.lat - origem.lat) * Math.PI) / 180;
  const dLng = ((destino.lng - origem.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((origem.lat * Math.PI) / 180) * Math.cos((destino.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return { km: Math.round(km * 10) / 10, minutos: Math.max(1, Math.round((km / 35) * 60)) };
}
