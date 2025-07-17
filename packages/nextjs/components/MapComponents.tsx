// File: components/MapComponent.tsx
'use client';

import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 1) Icona personalizzata per i negozi
const shopIcon = new L.Icon({
  iconUrl: '/icons/shop-pin.svg',    // metti questa SVG in /public/icons
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// 2) Helper per fare il fitBounds sui marker
function FitBounds({ bounds }: { bounds: L.LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.length) {
      map.fitBounds(bounds, {
        padding: [50, 50],
      });
    }
  }, [bounds, map]);
  return null;
}

type Shop = {
  name: string;
  description?: string;
  coords: [number, number];
};

export default function MapComponent() {
  // 3) I tuoi negozi mock (o dati reali che passi come prop)
  const shops: Shop[] = [
    {
      name: 'Supermercato A',
      description: 'Sconto 10% su frutta e verdura',
      coords: [40.853, 14.266],
    },
    {
      name: 'Panetteria B',
      description: 'Bread Rescue Today!',
      coords: [40.852, 14.2675],
    },
    {
      name: 'Ristorante C',
      description: 'Piatti avanzati a prezzo sociale',
      coords: [40.851, 14.269],
    },
  ];

  // 4) Costruiamo l’array di LatLng per FitBounds
  const markerPositions = shops.map((s) => s.coords);

  return (
    <MapContainer
      center={[40.8518, 14.2681]}
      zoom={15}
      style={{ height: '400px', width: '100%', borderRadius: 8 }}
      scrollWheelZoom={false}
    >
      {/* Tiles di OSM HOT, più pulite */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <FitBounds bounds={markerPositions} />

      {shops.map((shop, idx) => (
        <Marker
          key={idx}
          position={shop.coords}
          icon={shopIcon}
        >
          <Popup>
            <strong>{shop.name}</strong>
            <br />
            {shop.description || 'Nessuna descrizione'}
            <br />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${shop.coords.join(
                ','
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Apri in Google Maps
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
