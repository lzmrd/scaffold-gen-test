"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { parseEther} from "viem";
import { useAccount } from "wagmi";
import { CheckCircleIcon, ClockIcon, HeartIcon, MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useWriteContract } from "wagmi";
import { FOOD_RESCUE_PLATFORM_ABI } from "../../lib/abis/foodRescuePlatformABI";

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

const businesses: Business[] = [
  { id: 1, name: "Conad Centro Supermarket", type: "Supermarket", address: "Via Toledo, 123 - Naples", lat: 40.8518, lng: 14.2681, mealsNeeded: 45, description: "Fresh and packaged products", category: "grocery" },
  { id: 2, name: "Pizzeria Da Michele", type: "Restaurant", address: "Via Cesare Sersale, 1 - Naples", lat: 40.8467, lng: 14.2649, mealsNeeded: 20, description: "Pizza and bakery products", category: "restaurant" },
  { id: 3, name: "Carrefour Vomero", type: "Supermarket", address: "Via Scarlatti, 98 - Naples", lat: 40.8448, lng: 14.2357, mealsNeeded: 60, description: "Wide variety of food items", category: "grocery" },
  { id: 4, name: "Trattoria Nennella", type: "Restaurant", address: "Vico Lungo Teatro Nuovo, 103 - Naples", lat: 40.8434, lng: 14.2515, mealsNeeded: 15, description: "Prepared dishes and fresh ingredients", category: "restaurant" },
  { id: 5, name: "Lidl Fuorigrotta", type: "Supermarket", address: "Via Terracina, 197 - Naples", lat: 40.8267, lng: 14.1934, mealsNeeded: 35, description: "Discount packaged and fresh products", category: "grocery" },
];

const DonatePage: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [txError, setTxError] = useState<Error | null>(null);

  // Usa useScaffoldWriteContract invece di useWriteContract
  //const { writeContractAsync: writeFoodRescueAsync, isPending } = useScaffoldWriteContract("FoodRescuePlatform");

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetinaUrl.src || iconRetinaUrl,
      iconUrl: iconUrl.src || iconUrl,
      shadowUrl: iconShadowUrl.src || iconShadowUrl,
    });
  }, []);

  const handleSelect = (business: Business) => {
    if (!connectedAddress) {
      alert("Please connect your wallet first");
      return;
    }
    setSelectedBusiness(business);
    setShowAmountModal(true);
  };

  const { writeContract: writeApprove, data: approveHash } = useWriteContract();


      const handleDonationSubmit = async () => {
        if (!selectedBusiness || !donationAmount) return;

        const parsedAmount = parseFloat(donationAmount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          alert("Please enter a valid positive number");
          return;
        }

        setShowAmountModal(false);
        setShowMap(false);
        setTxStatus("pending");
        setTxError(null);



        try {
          const FOOD_RESCUE_PLATFORM_ADDRESS = process.env.PLATFORM_ADDRESS as `0x${string}`;
          writeApprove({
            address: FOOD_RESCUE_PLATFORM_ADDRESS, // Use the exact deployed contract address
            abi: FOOD_RESCUE_PLATFORM_ABI,
            functionName: "recordDonation",
            args: [
             BigInt(3)
            ]
          })

        } catch (err) {
          console.error("Transaction failed:", err);
          setTxStatus("error");
          setTxError(err as Error);
          setShowMap(true);
        }
      };

  const resetState = () => {
    setSelectedBusiness(null);
    setDonationAmount("");
    setTxStatus("idle");
    setShowMap(true);
    setShowAmountModal(false);
    setTxError(null);
  };

  const closeModal = () => {
    setShowAmountModal(false);
    setSelectedBusiness(null);
    setDonationAmount("");
  };

  // Monitora lo stato della transazione


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700">Donate a Meal</h1>
            <p className="text-gray-600">Select a partner in Naples</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Wallet</p>
            <p className="font-mono">{connectedAddress?.slice(0, 6)}…{connectedAddress?.slice(-4)}</p>
          </div>
        </div>
      </header>

      {/* Amount Modal */}
      {showAmountModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Donate to {selectedBusiness.name}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (kg of food)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter amount in kg"
                min="0"
                step="0.1"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDonationSubmit}
                disabled={!donationAmount }
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {!showMap && selectedBusiness && (
        <section className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {txStatus === "pending" && (
              <>
                <ClockIcon className="h-16 w-16 text-blue-500 animate-spin mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Processing Transaction...</h3>
                <p className="text-gray-600 mb-4">Donating {donationAmount} kg of food to {selectedBusiness.name}</p>
                <p className="text-sm text-gray-500">Please confirm the transaction in your wallet</p>
              </>
            )}
            {txStatus === "success" && (
              <>
                <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">Donation Successful!</h3>
                <p className="text-gray-600 mb-4">You donated {donationAmount} kg of food to {selectedBusiness.name}</p>
                <p className="text-sm text-gray-500 mb-6">You will receive ~{donationAmount} UMEALS tokens</p>
                <button onClick={resetState} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                  Make Another Donation
                </button>
              </>
            )}
            {txStatus === "error" && (
              <>
                <XMarkIcon className="h-16 w-16 text-red-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-red-600 mb-2">Transaction Failed</h3>
                <p className="text-gray-600 mb-4">An error occurred. Please try again.</p>
                {txError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
                    <p className="text-sm text-red-700">{txError.message}</p>
                  </div>
                )}
                <button onClick={resetState} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                  Try Again
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* Partner Grid */}
      {showMap && (
        <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
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
                      <strong>{b.name}</strong><br />{b.address}<br />
                      <button onClick={() => handleSelect(b)} className="mt-2 px-3 py-1 bg-green-600 text-white rounded">
                        Donate here
                      </button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Available Partners</h2>
            {businesses.map(b => (
              <div key={b.id} className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSelect(b)}>
                <h3 className="font-semibold text-gray-800">{b.name}</h3>
                <p className="text-sm text-gray-600">{b.type}</p>
                <p className="text-xs text-gray-500 mb-2">{b.address}</p>
                <p className="text-sm text-gray-700 mb-2">{b.description}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                    {b.mealsNeeded} meals needed
                  </span>
                  <HeartIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

export default DonatePage;
