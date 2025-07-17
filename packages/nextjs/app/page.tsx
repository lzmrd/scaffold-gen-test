"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  GiftIcon,
  HeartIcon,
  UserGroupIcon, // Add LeafIcon or use an alternative
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import Image from "next/image";




// Custom LeafIcon component if not available in @heroicons/react
const LeafIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 6-3 5-4-3-4 3-3-5z" />
  </svg>
);

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <div className="text-center mb-8">
           <div className="flex justify-center mb-4">
              <Image src="/logo.png" alt="UnwastedMeals Logo" width={196} height={196} />
           </div>
            <h1 className="text-center">
              <span className="block text-2xl mb-2 text-gray-600">Welcome to</span>
              <span className="block text-4xl font-bold text-green-700">Unwasted Meals</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              We fight food waste and poverty in Italy through blockchain tokens that certify every meal saved and
              donated to social canteens.
            </p>
          </div>

          <div className="flex justify-center items-center space-x-2 flex-col mb-8">
            <p className="my-2 font-medium text-gray-700">Connected Wallet:</p>
            <Address address={connectedAddress} />
          </div>

          <div className="bg-green-50 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <BuildingStorefrontIcon className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-medium text-green-700">Donate Food</h4>
                <p className="text-sm text-gray-600">Supermarkets and restaurants donate food that&apos;s still good</p>
              </div>
              <div className="flex flex-col items-center">
                <ChartBarIcon className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-medium text-green-700">Track Impact</h4>
                <p className="text-sm text-gray-600">Every donation generates certified tokens on blockchain</p>
              </div>
              <div className="flex flex-col items-center">
                <GiftIcon className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-medium text-green-700">Get Rewards</h4>
                <p className="text-sm text-gray-600">Discounts, tax benefits and credits for social services</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grow bg-green-50 w-full mt-8 px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-8">Get Started Now</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col bg-white px-8 py-8 text-center items-center rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <HeartIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-3">Donate Food</h3>
                <p className="text-gray-600 mb-4">
                  Register your food donations and generate tokens for every meal saved.
                </p>
                <Link
                  href="/donate"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start Donating
                </Link>
              </div>

              <div className="flex flex-col bg-white px-8 py-8 text-center items-center rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Monitor Impact</h3>
                <p className="text-gray-600 mb-4">View donation statistics and the impact on the community.</p>
                <Link
                  href="/impact"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Statistics
                </Link>
              </div>

              <div className="flex flex-col bg-white px-8 py-8 text-center items-center rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-orange-100 p-3 rounded-full mb-4">
                  <GiftIcon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-orange-800 mb-3">Redeem Rewards</h3>
                <p className="text-gray-600 mb-4">Use your tokens to get discounts and benefits from partners.</p>
                <Link
                  href="/rewards"
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Your Rewards
                </Link>
              </div>
            </div>

            <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <UserGroupIcon className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-green-800">Community Impact</h3>
              </div>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">1,247</div>
                  <div className="text-sm text-gray-600">Meals Saved</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">89</div>
                  <div className="text-sm text-gray-600">Active Partners</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">456</div>
                  <div className="text-sm text-gray-600">Families Helped</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">2.1t</div>
                  <div className="text-sm text-gray-600">CO₂ Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
