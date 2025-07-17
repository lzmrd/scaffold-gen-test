// File: app/rewards/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAccount, useContractRead } from 'wagmi';
import { ethers } from 'ethers';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Carica react-leaflet solo in client-side
const MapWithNoSSR = dynamic(
  () =>
    import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup, useMap }) => {
      // Icona personalizzata per i negozi
      const shopIcon = new L.Icon({
        iconUrl: '/icons/shop-pin.svg',  // metti /public/icons/shop-pin.svg
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Component che fa il fitBounds su tutti i marker
      function FitBounds({ bounds }: { bounds: [number, number][] }) {
        const map = useMap();
        useEffect(() => {
          if (bounds.length) {
            map.fitBounds(bounds, { padding: [40, 40] });
          }
        }, [bounds, map]);
        return null;
      }

      // I tuoi negozi mock con descrizione
      const shops = [
        {
          name: 'Supermercato A',
          description: 'Sconto 10% su frutta e verdura',
          coords: [40.853, 14.266] as [number, number],
        },
        {
          name: 'Panetteria B',
          description: 'Pane fresco rescued daily',
          coords: [40.852, 14.2675] as [number, number],
        },
        {
          name: 'Ristorante C',
          description: 'Piatti avanzati a prezzo sociale',
          coords: [40.851, 14.269] as [number, number],
        },
      ];

      const bounds = shops.map((s) => s.coords);

      return () => (
        <MapContainer
          center={[40.8518, 14.2681]}
          zoom={15}
          style={{ height: 400, width: '100%', borderRadius: 8 }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <FitBounds bounds={bounds} />
          {shops.map((s, i) => (
            <Marker key={i} position={s.coords} icon={shopIcon}>
              <Popup>
                <strong>{s.name}</strong>
                <br />
                {s.description}
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${s.coords.join(',')}`}
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
    }),
  { ssr: false }
);

export default function RewardsPage() {
  const { address } = useAccount();
  const [redeeming, setRedeeming] = useState(false);

  // Legge il balance UMEALS ERC20
  const { data: raw } = useContractRead({
    address: '0x1234567890abcdef1234567890abcdef12345678' as `0x${string}`,
    abi: [
      {
        constant: true,
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
        stateMutability: 'view',
      },
    ],
    functionName: 'balanceOf',
    args: address ? ([address] as [`0x${string}`]) : undefined,
    
  });
  const balance = raw ? ethers.formatUnits(raw, 18) : '10';

  const handleRedeem = () => {
    if (balance === '0') return;
    setRedeeming(true);
    setTimeout(() => {
      alert('Rewards redeemed! You have 10% of discount for your favourite food');
      setRedeeming(false);
    }, 800);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 16 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 16 }}>Your Rewards</h1>

      <p style={{ textAlign: 'center', fontSize: 18 }}>
        You have <strong>{balance}</strong> UMEALS tokens
      </p>

      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <button
          onClick={handleRedeem}
          disabled={redeeming || balance === '0'}
          style={{
            background: '#f97316',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 6,
            opacity: redeeming || balance === '0' ? 0.5 : 1,
            cursor: redeeming || balance === '0' ? 'not-allowed' : 'pointer',
          }}
        >
          {redeeming ? 'Redeeming...' : 'Redeem your rewards'}
        </button>
      </div>

      <MapWithNoSSR />
    </div>
  );
}
