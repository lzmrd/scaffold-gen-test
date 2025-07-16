// packages/nextjs/app/donate/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CheckCircleIcon, ClockIcon, HeartIcon, MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";

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

// FoodRescuePlatform contract ABI (simplified)
const FOOD_RESCUE_PLATFORM_ABI = [
  {
    inputs: [
      {
        internalType: "contract UnwastedMeals",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AccessControlBadConfirmation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "neededRole",
        type: "bytes32",
      },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "donor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "kilos",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountMinted",
        type: "uint256",
      },
    ],
    name: "DonationRecorded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DONOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "kilos",
        type: "uint256",
      },
    ],
    name: "recordDonation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "donor",
        type: "address",
      },
    ],
    name: "registerDonor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "callerConfirmation",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract UnwastedMeals",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
// Replace with your actual deployed contract address
const FOOD_RESCUE_PLATFORM_ADDRESS = "0xf9B54077E7bB77a63F5FB771B434D64A7C0626f5" as const;

const DonatePage: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [showMap, setShowMap] = useState(true);
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Configure Leaflet default icon
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetinaUrl.src || iconRetinaUrl,
      iconUrl: iconUrl.src || iconUrl,
      shadowUrl: iconShadowUrl.src || iconShadowUrl,
    });
  }, []);

  // Handle transaction success
  useEffect(() => {
    if (hash && !isConfirming) {
      setTxStatus("success");
    }
  }, [hash, isConfirming]);

  // Handle transaction error
  useEffect(() => {
    if (error) {
      console.error("Contract write error:", error);
      setTxStatus("error");
    }
  }, [error]);

  const handleSelect = async (business: Business) => {
    setSelectedBusiness(business);

    // Prompt user for donation amount
    const amount = prompt(`How many kg of food do you want to donate to ${business.name}?`);

    if (!amount || !connectedAddress) {
      // If user cancels or no wallet connected, reset state
      setSelectedBusiness(null);
      return;
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid positive number");
      setSelectedBusiness(null);
      return;
    }

    setDonationAmount(amount);
    setShowMap(false);
    setTxStatus("pending");

    try {
      // Calculate donation value (example: 0.01 ETH per kg)
      const donationValue = parseEther((parsedAmount * 0.01).toString());

      console.log("Initiating transaction with:", {
        address: FOOD_RESCUE_PLATFORM_ADDRESS,
        functionName: "recordDonation",
        args: [BigInt(Math.floor(parsedAmount)), BigInt(business.id)],
        value: donationValue,
      });

      await writeContract({
        address: FOOD_RESCUE_PLATFORM_ADDRESS,
        abi: FOOD_RESCUE_PLATFORM_ABI,
        functionName: "recordDonation",
        args: [BigInt(Math.floor(parsedAmount)), BigInt(business.id)],
        value: donationValue,
      });
    } catch (err) {
      console.error("Transaction failed:", err);
      setTxStatus("error");
    }
  };

  const resetState = () => {
    setSelectedBusiness(null);
    setDonationAmount("");
    setTxStatus("idle");
    setShowMap(true);
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

      {/* Transaction Status Screen */}
      {!showMap && selectedBusiness && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Donation to {selectedBusiness.name}</h2>
              <p className="text-gray-600">{selectedBusiness.description}</p>
            </div>

            {txStatus === "pending" && (
              <div className="flex flex-col items-center">
                <ClockIcon className="h-16 w-16 text-blue-500 animate-spin mb-4" />
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Processing Transaction...</h3>
                <p className="text-gray-600 mb-4">Donating {donationAmount} kg of food</p>
                <p className="text-sm text-gray-500">Please confirm the transaction in your wallet</p>
              </div>
            )}

            {txStatus === "success" && (
              <div className="flex flex-col items-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">Donation Successful!</h3>
                <p className="text-gray-600 mb-4">You donated {donationAmount} kg of food</p>
                <p className="text-sm text-gray-500 mb-6">You will receive ~{donationAmount} UMEALS tokens</p>
                <button
                  onClick={resetState}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Make Another Donation
                </button>
              </div>
            )}

            {txStatus === "error" && (
              <div className="flex flex-col items-center">
                <XMarkIcon className="h-16 w-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-600 mb-2">Transaction Failed</h3>
                <p className="text-gray-600 mb-4">There was an error processing your donation. Please try again.</p>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-md">
                    <p className="text-sm text-red-700">Error: {error.message || "Unknown error"}</p>
                  </div>
                )}
                <button onClick={resetState} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main grid - Only show when map is visible */}
      {showMap && (
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
                      <button
                        className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => handleSelect(b)}
                      >
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
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
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
      )}
    </div>
  );
};

export default DonatePage;
