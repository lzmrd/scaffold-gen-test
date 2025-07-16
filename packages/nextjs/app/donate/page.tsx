// packages/nextjs/app/donate/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CheckCircleIcon, ClockIcon, HeartIcon, MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";

// packages/nextjs/app/donate/page.tsx

// packages/nextjs/app/donate/page.tsx

// packages/nextjs/app/donate/page.tsx

// packages/nextjs/app/donate/page.tsx

// packages/nextjs/app/donate/page.tsx

// packages/nextjs/app/donate/page.tsx

// packages/nextjs/app/donate/page.tsx

// packages/nextjs/app/donate/page.tsx

// packages/nextjs/app/donate/page.tsx

// packages/nextjs/app/donate/page.tsx

// Load Leaflet components only on client to avoid SSR errors
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface Business {
  id: number;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  mealsNeeded: number;
  description: string;
  category: string;
}

// Mock data for partner businesses
const businesses: Business[] = [
  {
    id: 1,
    name: "Conad Centro Supermarket",
    type: "Supermarket",
    address: "Via Toledo, 123 - Naples",
    lat: 40.8518,
    lng: 14.2681,
    mealsNeeded: 45,
    description: "Fresh and packaged products",
    category: "grocery",
  },
  {
    id: 2,
    name: "Pizzeria Da Michele",
    type: "Restaurant",
    address: "Via Cesare Sersale, 1 - Naples",
    lat: 40.8467,
    lng: 14.2649,
    mealsNeeded: 20,
    description: "Pizza and bakery products",
    category: "restaurant",
  },
  {
    id: 3,
    name: "Carrefour Vomero",
    type: "Supermarket",
    address: "Via Scarlatti, 98 - Naples",
    lat: 40.8448,
    lng: 14.2357,
    mealsNeeded: 60,
    description: "Wide variety of food items",
    category: "grocery",
  },
  {
    id: 4,
    name: "Trattoria Nennella",
    type: "Restaurant",
    address: "Vico Lungo Teatro Nuovo, 103 - Naples",
    lat: 40.8434,
    lng: 14.2515,
    mealsNeeded: 15,
    description: "Prepared dishes and fresh ingredients",
    category: "restaurant",
  },
  {
    id: 5,
    name: "Lidl Fuorigrotta",
    type: "Supermarket",
    address: "Via Terracina, 197 - Naples",
    lat: 40.8267,
    lng: 14.1934,
    mealsNeeded: 35,
    description: "Discount packaged and fresh products",
    category: "grocery",
  },
];

const DonatePage: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Configure Leaflet default icon - MOVED INSIDE THE COMPONENT
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetinaUrl.src || iconRetinaUrl,
      iconUrl: iconUrl.src || iconUrl,
      shadowUrl: iconShadowUrl.src || iconShadowUrl,
    });
  }, []);

  const handleSelect = (b: Business) => {
    setSelectedBusiness(b);
    setIsModalOpen(true);
  };

  const handleDonate = async () => {
    if (!selectedBusiness || !donationAmount || !connectedAddress) return;
    setTxStatus("pending");
    try {
      await writeContract({
        address: "0xYourPlatformContractAddress",
        abi: [
          /* FoodRescuePlatform ABI */
        ],
        functionName: "recordDonation",
        args: [Math.floor(parseFloat(donationAmount))],
      });
      setTxStatus("success");
    } catch {
      setTxStatus("error");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
    setDonationAmount("");
    setTxStatus("idle");
  };

  // If wallet is not connected
  if (!connectedAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Connect Wallet</h2>
          <p className="text-gray-500">You need to connect your wallet to donate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700">Donate a Meal</h1>
            <p className="text-gray-600">Select a partner in Naples</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Wallet</p>
            <p className="font-mono">{`${connectedAddress.slice(0, 6)}…${connectedAddress.slice(-4)}`}</p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-green-50 border-b flex items-center">
              <MapPinIcon className="h-6 w-6 text-green-800 mr-2" />
              <h2 className="text-xl font-semibold text-green-800">Partner Map</h2>
            </div>
            <MapContainer center={[40.8518, 14.2681]} zoom={13} className="h-96 w-full" scrollWheelZoom={false}>
              <TileLayer
                attribution='© <a href="https://osm.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                subdomains={["a", "b", "c"]}
                crossOrigin={true}
              />
              {businesses.map(b => (
                <Marker key={b.id} position={[b.lat, b.lng]} eventHandlers={{ click: () => handleSelect(b) }}>
                  <Popup>
                    <strong>{b.name}</strong>
                    <br />
                    {b.address}
                    <br />
                    <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded" onClick={() => handleSelect(b)}>
                      Donate here
                    </button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Partner list */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Available Partners</h2>
          {businesses.map(b => (
            <div
              key={b.id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
              onClick={() => handleSelect(b)}
            >
              <h3 className="font-semibold text-gray-800">{b.name}</h3>
              <p className="text-sm text-gray-600">{b.type}</p>
              <p className="text-xs text-gray-500">{b.address}</p>
              <p className="mt-2 text-sm">{b.description}</p>
              <div className="mt-2 inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                {b.mealsNeeded} meals needed
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donation modal */}
      {isModalOpen && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Donate to {selectedBusiness.name}</h3>
              <button onClick={closeModal}>
                <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{selectedBusiness.description}</p>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kg of food saved</label>
            <input
              type="number"
              step="1"
              min="1"
              value={donationAmount}
              onChange={e => setDonationAmount(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. 5"
            />
            <p className="mt-1 text-xs text-gray-500">You will receive ~{donationAmount || 0} UMEALS</p>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                disabled={!donationAmount || txStatus === "pending"}
                className="flex-1 bg-green-600 text-white rounded-lg px-4 py-2 disabled:opacity-50 flex items-center justify-center"
              >
                {txStatus === "pending" || isConfirming ? (
                  <>
                    <ClockIcon className="h-5 w-5 mr-2 animate-spin" />
                    Waiting…
                  </>
                ) : txStatus === "success" ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Completed!
                  </>
                ) : (
                  <>
                    <HeartIcon className="h-5 w-5 mr-2" />
                    Confirm
                  </>
                )}
              </button>
            </div>
            {txStatus === "error" && <p className="mt-4 text-sm text-red-600">Transaction error, please try again.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonatePage;
